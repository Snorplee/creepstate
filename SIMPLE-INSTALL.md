# Creepstate Investigation Platform - Simple Website Installation

This guide shows how to install the Creepstate Investigation Platform investigation on any web hosting service or simple web server.

## Quick Installation Methods

### Method 1: Static Website Hosting (Recommended)

#### GitHub Pages (Free)
1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main branch
4. Your site will be available at `https://yourusername.github.io/creepstate`

#### Netlify (Free)
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy with these settings:
   - Build command: (leave empty)
   - Publish directory: `/`
4. Your site will be available at a custom Netlify URL

#### Vercel (Free)
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with default settings
4. Your site will be available at a custom Vercel URL

### Method 2: Traditional Web Hosting

#### Shared Hosting (cPanel, etc.)
1. Download all files from this repository
2. Upload to your web hosting's public_html folder via FTP or File Manager:
   ```
   public_html/
   ├── index.html
   ├── enhanced-visualizations.html
   ├── slideshow-timeline.html
   ├── stats.html
   ├── resources.html
   ├── names-and-shame.html
   ├── documentation.html
   ├── timeline-comprehensive.xml
   ├── events-simple.xml
   └── images/
   ```
3. Access your site at `https://yourdomain.com`

#### VPS/Dedicated Server
1. Install nginx or apache
2. Clone repository to web directory
3. Configure web server to serve static files
4. Optional: Use Docker method below

### Method 3: Docker (Advanced)

#### Quick Docker Run
```bash
# Clone repository
git clone https://github.com/Snorplee/creepstate.git
cd creepstate

# Build and run
docker build -t creepstate .
docker run -d -p 8847:80 --name creepstate creepstate

# Access at http://localhost:8847
```

#### Docker with Custom Domain
```bash
# Run on port 80
docker run -d -p 80:80 --name creepstate creepstate

# Access at http://yourdomain.com
```

## File Requirements

### Essential Files (Minimum Installation)
- `index.html` - Main timeline page
- `timeline-comprehensive.xml` - Timeline data
- `enhanced-visualizations.html` - Network visualizations
- `images/` folder - Timeline images

### Complete Installation
All HTML files and supporting documents for full functionality.

### Dependencies
All dependencies are loaded from CDNs, so no local installation required:
- SIMILE Timeline Widget
- D3.js for visualizations
- Chart.js for statistics
- Reveal.js for slideshows

## Configuration

### Basic Setup
No configuration needed - works out of the box.

### Custom Domain
Update the following if using a custom domain:
1. No code changes required
2. Just point your domain to the hosting service

### HTTPS/SSL
- GitHub Pages: Automatic HTTPS
- Netlify/Vercel: Automatic HTTPS
- Shared Hosting: Configure in hosting control panel
- VPS: Use Let's Encrypt (see SERVER-SETUP.md)

## Updating Content

### Timeline Events
Edit `timeline-comprehensive.xml` to add new events:
```xml
<event start="2025-01-01" title="New Event" icon="timeline_icons/icon.png">
    Event description with &lt;a href="url"&gt;links&lt;/a&gt; and &lt;img src="image.jpg"/&gt;
</event>
```

### Adding Images
1. Upload images to `images/` folder
2. Reference in XML: `&lt;img src="images/filename.jpg"/&gt;`
3. Supported formats: JPG, PNG, GIF, WebP

### Names & Shame Updates
Edit `names-and-shame.html` to add/modify entries in the network directory.

## Troubleshooting

### Common Issues

#### Timeline Not Loading
- Check `timeline-comprehensive.xml` is accessible
- Verify XML syntax is valid
- Check browser console for errors

#### Images Not Displaying
- Verify image files exist in `images/` folder
- Check file paths in XML
- Ensure proper HTML encoding: `&lt;img src="..."&gt;`

#### Visualizations Not Working
- Check internet connection (CDN dependencies)
- Verify JavaScript is enabled
- Check browser console for errors

#### Mobile Display Issues
- All pages are responsive
- Test on different screen sizes
- Report issues if found

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Internet Explorer: Not supported

## Performance Optimization

### For High Traffic
1. Use a CDN (Cloudflare, etc.)
2. Enable gzip compression
3. Optimize images
4. Use caching headers

### Image Optimization
```bash
# Compress images before upload
jpegoptim --max=85 *.jpg
pngquant --quality=65-80 *.png
```

## Security Considerations

### Public Hosting
- All content is public by default
- No sensitive data stored locally
- All external links are properly encoded

### Private Installation
- Use basic authentication if needed
- Configure firewall rules
- Use HTTPS for any sensitive deployment

## Monitoring and Analytics

### Add Google Analytics
Add this to all HTML files before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Simple Uptime Monitoring
Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

## Backup and Updates

### Automatic Updates (GitHub)
If using GitHub Pages/Netlify/Vercel:
1. Updates to main branch automatically deploy
2. No manual intervention needed

### Manual Updates
1. Download latest files
2. Replace on your hosting
3. Clear any caches

### Backup Strategy
- Repository serves as primary backup
- Download full site periodically
- Keep local copies of custom modifications

## Support and Maintenance

### Regular Tasks
- Monitor for broken links
- Update timeline with new events
- Check image availability
- Review and update names directory

### Getting Help
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Test on different devices/browsers
4. Contact hosting support if needed

## Cost Estimates

### Free Options
- GitHub Pages: $0
- Netlify: $0 (with limits)
- Vercel: $0 (with limits)

### Paid Hosting
- Shared hosting: $3-10/month
- VPS: $5-20/month
- Dedicated: $50+/month

### Custom Domain
- Domain registration: $10-15/year
- SSL certificate: Free (Let's Encrypt) or $10-50/year

Choose the method that best fits your technical skills and requirements!