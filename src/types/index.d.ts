// Magic to stop TS compiler complaining about some files
// I don't really understand why this is required
// or how this works but the red squiggly line went
// away and the site still built and the styles worked.
// Something something webpack bundler?
declare module '*.module.scss'
declare module '*.mp4'
declare module '*.webm'
declare module '*.jpg'
