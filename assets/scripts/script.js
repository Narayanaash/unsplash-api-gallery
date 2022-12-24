$(document).ready(function () {
  var imageList = null;
  var clickedImage = null;
  var currentPreviewIndex = null;
  function formateDate(dateString) {
    var date = new Date(dateString);
    var formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return formattedDate;
  }

  $html = "";
  $.ajax({
    url: "https://api.unsplash.com/search/photos?query=landscape&per_page=24&client_id=oau70oGQxc-O7_ET2WOI7nAvfQCSImFkq4yXkORlq74",
    success: function (res) {
      imageList = res.results;
      res.results.forEach((item) => {
        $html += '<figure class="gallery__item" data-id="' + item.id + '">';
        $html +=
          '<img loading="lazy" class="gallery__item__img" src="' +
          item.urls.small +
          '" alt="' +
          item.alt_description +
          '">';
        $html += '<div class="gallery__item__bottom">';
        $html +=
          '<a class="user" href="https://unsplash.com/@' +
          item.user.username +
          '" target="_blank">';
        $html +=
          '<img loading="lazy" class="user__img" src="' +
          item.user.profile_image.small +
          '">';
        $html += "<figcaption>" + item.user.first_name + "</figcaption>";
        $html += "</a>";
        $html +=
          '<a href="' +
          item.links.download +
          '&force=true" class="download__btn"></a>';
        $html += "</div>";
        $html += "</figure>";
      });
      $(".gallery").html($html);
    },
  });

  $(document).on("click", ".gallery__item", function (e) {
    if (e.target.classList.contains("gallery__item__bottom")) {
      clickedImage = imageList.filter(
        (item) => item.id === $(this).data("id")
      )[0];

      currentPreviewIndex = imageList.findIndex(
        (item) => item === clickedImage
      );

      initDialogPreview();
      $("body").css("overflow", "hidden");
      $(".dialog").css("display", "block");
    }
  });

  $(".dialog__close").click(function () {
    $(".dialog").css("display", "none");
    $("body").css("overflow", "auto");
    $(".dialog__preview").removeClass("full");
  });

  $(".dialog__preview").click(function () {
    $(this).toggleClass("full");
    setTimeout(() => {
      $(".dialog__preview img").attr("src", clickedImage.urls.full);
    }, 1000);
  });

  $(document).on("click", ".dialog", function (e) {
    if (e.target.classList.contains("dialog")) {
      $(".dialog").css("display", "none");
      $("body").css("overflow", "auto");
      $(".dialog__preview").removeClass("full");
    }
  });

  $(document).on("click", ".dialog__navPrev", function () {
    if (currentPreviewIndex !== 0) {
      clickedImage = imageList[currentPreviewIndex - 1];
      currentPreviewIndex--;
      initDialogPreview();
    }
  });

  $(document).on("click", ".dialog__navNext", function () {
    if (currentPreviewIndex + 1 !== imageList.length) {
      clickedImage = imageList[currentPreviewIndex + 1];
      currentPreviewIndex++;
      initDialogPreview();
    }
  });

  function initDialogPreview() {
    checkForNav();
    $(".user").attr(
      "href",
      "https://unsplash.com/@" + clickedImage.user.username
    );
    $(".user__img").attr("src", clickedImage.user.profile_image.small);
    $(".user__name").text(clickedImage.user.first_name);
    $(".download__textBtn").attr(
      "href",
      clickedImage.links.download + "&force=true"
    );
    $(".dialog__preview img").attr("src", clickedImage.urls.regular);
    $(".likes").text(clickedImage.likes);
    $(".pDate span").text(formateDate(clickedImage.created_at));
    $(".location").text(clickedImage.user.location);
  }

  function checkForNav() {
    if (currentPreviewIndex === 0) {
      $(".dialog__navPrev").addClass("disabled");
      $(".dialog__navNext").removeClass("disabled");
    } else if (
      currentPreviewIndex > 0 &&
      currentPreviewIndex + 1 !== imageList.length
    ) {
      $(".dialog__navPrev").removeClass("disabled");
      $(".dialog__navNext").removeClass("disabled");
    } else {
      $(".dialog__navNext").addClass("disabled");
    }
  }
});
