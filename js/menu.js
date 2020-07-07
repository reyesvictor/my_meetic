$('#search-nav').hide();
myOnClick('#nav-menu-title', animateMenu);
$(`#search-nav`).css('opacity', '0');
let i = 0;

function animateMenu(e, here) {
  $(`#search-nav`).animate({
    width: 'toggle', 
    opacity: '1',
  }, 350);  

  if ( !(i % 2) ) {
    $(`#${here.id}`).animate(
      { deg: 90 },
      {
        duration: 600,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  } else {
    $(`#${here.id}`).animate(
      { deg: 0 },
      {
        duration: 600,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  }
  i++;
}
