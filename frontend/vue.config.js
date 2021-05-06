module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    progress: false,
    disableHostCheck: true, 
    port: 8080,
    watchOptions: {
      poll: true,
    },
  }
}
