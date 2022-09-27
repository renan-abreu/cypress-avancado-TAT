const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://wlsf82-hacker-stories.web.app/',
    watchForFileChanges: false,
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
