module.exports = {
  data: {
    imageGallery: false,
  },
  ImageClose: function () {
    this.setData({
      imageGallery: false,
    })
  },
  ImageOpen: function () {
    this.setData({
      imageGallery: true,
    })
  },
}