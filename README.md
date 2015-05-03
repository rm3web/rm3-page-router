# Page Router

When you are trying to do resource-specific routing in Express where the 
actual set of routes you are trying to mount aren't known until you 
have queried the node from the database, you can't just use Express 4's
router functionality because it's build to do a static mount.

This is designed to be just enough of a router to fill in the gap.

It's heavily inspired by Express 4's router.  So much so that the Express 4 copyright holders are kept on the license to avoid any possible confusion.

## Contributing

Submit PR's.

## License?

MIT, see LICENSE.txt
