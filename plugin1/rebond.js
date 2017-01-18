// todo transformer cette fonction en plugin
    $(function() {
      var x, y, affX, affY, initX, initY;
      initX = parseInt($(this).css('left'));
      initY = parseInt($(this).css('top'));
      for (x = (Math.PI)/2; x < (8*Math.PI); x = x+.2)
      {
        y = (Math.abs(Math.sin(x)))/x;
        affX = initX + x * amplX;
        affY = initY - y * amplY;
        $(this).animate({left: affX, top: affY},10);
      }
    });

// todo ne pas oublier le return pour pouvoir chainer les appels

