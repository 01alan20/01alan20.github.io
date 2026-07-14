# Site Build Notes

## Framework choice

StoryMapJS was rejected as the main framework because the project is not a short sequence of locations. It moves between national trends, state markets, county recruitment pools, thousands of institutions and editable financial scenarios.

The site uses:

- semantic HTML and modern CSS;
- vanilla JavaScript for controls and state;
- Plotly for charts and maps;
- browser `IntersectionObserver` for scrollytelling;
- locally bundled state geometry and Plotly JavaScript;
- JSON data files that can be regenerated from the project scripts;
- GitHub Pages deployment with no application server.

## Current sections

1. The known demographic squeeze
2. The less reliable international cushion
3. National student-market funnel
4. State market changes
5. County recruitment markets
6. Institution exposure
7. Enrollment-related financial pressure
8. Risk interpretation and data limitations

## Deployment

Upload the folder contents to the root of a GitHub repository and enable GitHub Pages. The included workflow can also deploy the site automatically.
