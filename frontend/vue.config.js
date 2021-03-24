module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    disableHostCheck: true, 
    port: 8080,
    watchOptions: {
      poll: true,
    },
  },
}
