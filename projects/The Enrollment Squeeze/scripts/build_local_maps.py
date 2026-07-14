import json, math
from pathlib import Path
import geopandas as gpd
from shapely.ops import transform
from shapely import affinity
from pyproj import Transformer

SITE=Path('/mnt/data/enrollment_squeeze_site')
shp='/opt/pyvenv/lib/python3.13/site-packages/mpl_toolkits/basemap_data/UScounties.shp'
counties=gpd.read_file(shp)
valid=set()
with open(SITE/'data/states.json') as f:
    valid={r['state'] for r in json.load(f)}
counties=counties[counties['STATE'].isin(valid)].copy()
states=counties.dissolve(by='STATE', as_index=False)
# A single Albers equal-area projection; Alaska and Hawaii are then inset.
transformer=Transformer.from_crs('EPSG:4269', '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +datum=NAD83 +units=m +no_defs', always_xy=True)
states['geometry']=states.geometry.apply(lambda g: transform(transformer.transform,g))
conus=states[~states.STATE.isin(['AK','HI'])]
minx,miny,maxx,maxy=conus.total_bounds
W=maxx-minx; H=maxy-miny
params={}
for abbr,scale,target in [
    ('AK',0.34,(minx+0.14*W,miny+0.10*H)),
    ('HI',1.15,(minx+0.30*W,miny+0.08*H)),
]:
    idx=states.index[states.STATE==abbr][0]
    g=states.loc[idx,'geometry']
    c=g.centroid
    gs=affinity.scale(g,xfact=scale,yfact=scale,origin=(c.x,c.y))
    dx=target[0]-gs.centroid.x; dy=target[1]-gs.centroid.y
    states.loc[idx,'geometry']=affinity.translate(gs,xoff=dx,yoff=dy)
    params[abbr]={'scale':scale,'origin':[c.x,c.y],'offset':[dx,dy]}

def geometry_xy(g):
    xs=[];ys=[]
    polys=list(g.geoms) if g.geom_type=='MultiPolygon' else [g]
    for p in polys:
        coords=list(p.exterior.coords)
        xs.extend([round(x,1) for x,y in coords]+[None])
        ys.extend([round(y,1) for x,y in coords]+[None])
    if xs: xs.pop(); ys.pop()
    return xs,ys
shapes=[]
for _,r in states.sort_values('STATE').iterrows():
    x,y=geometry_xy(r.geometry.simplify(8000,preserve_topology=True))
    shapes.append({'state':r.STATE,'x':x,'y':y})
with open(SITE/'data/state_shapes.json','w') as f: json.dump(shapes,f,separators=(',',':'))

# Add projected/inset coordinates to institution records.
inst_path=SITE/'data/institutions.json'
with open(inst_path) as f: inst=json.load(f)
for d in inst:
    lon=d.get('lon'); lat=d.get('lat')
    if lon is None or lat is None:
        d['mapX']=d['mapY']=None; continue
    x,y=transformer.transform(lon,lat)
    abbr=d.get('state')
    if abbr in params:
        p=params[abbr]; ox,oy=p['origin']; s=p['scale']; dx,dy=p['offset']
        x=ox+(x-ox)*s+dx; y=oy+(y-oy)*s+dy
    d['mapX']=round(x,1); d['mapY']=round(y,1)
with open(inst_path,'w') as f: json.dump(inst,f,separators=(',',':'))

# Save extent for consistent layouts.
extent=states.total_bounds.tolist()
with open(SITE/'data/map_meta.json','w') as f: json.dump({'extent':[round(v,1) for v in extent]},f)
print('states',len(shapes),'institutions',len(inst),'extent',extent)
