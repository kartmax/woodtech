document.addEventListener('DOMContentLoaded', function() {

   const keys = {
      ESC: 27
   }

   //========================================================
   //==================== Модальное окно ====================
   //========================================================
   MicroModal.init({
      openTrigger : 'data-modal-open',
      closeTrigger : 'data-modal-close',
      disableScroll : true,
      // disableFocus : true,
      awaitOpenAnimation : true,
      awaitCloseAnimation : true,

      onShow : function() {
         // Устраняю сдвиг-дергание контента в момент открытия модального окна
         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
            document.body.classList.add('js-open-modal');
            document.querySelector('.modal__overlay').classList.add('js-open-modal');
         };
      },
      onClose: function() {
         // Устраняю сдвиг-дергание контента в момент закрытия модального окна
         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
            document.body.classList.remove('js-open-modal');
            document.querySelector('.modal__overlay').classList.remove('js-open-modal');
         };
      }
   })

   // Прокидываю значение data-form из кнопки открытия модального окна в скрытый input формы
   // для дальнейшей идентификации формы при обработке запросов на сервере
   // так как модальное окно с формой универсальны
   const btnsOpenModal = document.querySelectorAll('[data-modal-open]');
   if(btnsOpenModal.length > 0) {
      Array.from(btnsOpenModal).forEach((btn) => {
         btn.addEventListener('click', function() {
            document.querySelector('.modal.is-open [name=form]').value = this.getAttribute('data-form');
         })
      })
   }
   // Очищаю значение скрытого input формы при закрытии модального окна
   const elemetsCloseModal = document.querySelectorAll('[data-modal-close]');
   if(elemetsCloseModal.length > 0) {
      Array.from(elemetsCloseModal).forEach((el) => {
         el.addEventListener('click', function() {
            document.querySelector('.modal.is-open [name=form]').value = '';
         })
      })
   }

   // Если закрытие модального окна будет происходить по нажатию кнопки Esc с клавиатуры --
   // возвращаю фокус на последний активный элемент на момент октрытия этого модального окна
   const btnCallbackBtn = document.querySelectorAll('.home-callback__button');
   if(btnCallbackBtn.length > 0) {
      let lastActiveEl;
      Array.from(btnCallbackBtn).forEach((btn) => {
         btn.addEventListener('click', function(e) {
            lastActiveEl = document.activeElement;
         });
      });
      document.addEventListener('keydown', function(e) {
         if(document.querySelector('.is-open') && e.keyCode == keys.ESC) {
            lastActiveEl.focus();
            document.querySelector('.modal.is-open [name=form]').value = '';
         }
      })
   }

   //======================================================
   //==================== Главное меню ====================
   //======================================================
   const w = {
      open_menu : 'Открыть меню',
      close_menu : 'Закрыть меню'
   }

   const topMenu = document.querySelector('.top-menu');
   const btnMobMenu = document.querySelector('.menu-toggle');
   const navbar = document.querySelector('.navbar');
   const logo = document.querySelector('.logo');
   const body = document.body;
   let laterActiveElement;

   function inertLogicToggleMenu (bool) {
      Array.from(body.children).forEach((child) => {
         if (child !== navbar) {
            child.inert = bool;
         }
         if(child === navbar) {
            logo.inert = bool;
         }
      })
   }

   function toggleMenu () {
      btnMobMenu.classList.toggle('menu-toggle_active');
      if( btnMobMenu.classList.contains('menu-toggle_active') === true) {
         laterActiveElement = document.activeElement;
         btnMobMenu.setAttribute('aria-label', w.close_menu);
         inertLogicToggleMenu(true);
         document.addEventListener('keydown', (e) => {
            if( btnMobMenu.classList.contains('menu-toggle_active') === true){
               if (e.keyCode == keys.ESC) {
                  closeMenu();
                  laterActiveElement.focus();
               }
            }
         })
      } else {
         btnMobMenu.setAttribute('aria-label', w.open_menu);
         inertLogicToggleMenu(false);
      }

      topMenu.classList.toggle('top-menu_active');
   }

   function closeMenu () {
      btnMobMenu.classList.remove('menu-toggle_active');
      btnMobMenu.setAttribute('aria-label', w.open_menu);
      topMenu.classList.remove('top-menu_active');
      inertLogicToggleMenu(false);
   }

   btnMobMenu.addEventListener('click', function(){ toggleMenu() })

   document.addEventListener('click', function(e) {
      if(topMenu.classList.contains('top-menu_active')) {
         if(e.target.closest('.menu-container')) { return };
         closeMenu();
      };
   });

   window.addEventListener('orientationchange', function () {
      let stylesBtnMenu = getComputedStyle(btnMobMenu);
      if (stylesBtnMenu.display === 'block') {
         closeMenu();
      };
   });


   //=====================================================
   //==================== SWIPER-SLIDERS ====================
   //=====================================================

   // home-slider
   const homeSlider = new Swiper('.home-slider', {
      speed : 800,
      effect : 'fade',
      centeredSlides : true,
      // loop : true,
      pagination : {
         el : '.home-slider__pagination',
         type : 'custom',
         renderCustom  : function(swiper, current, total) {
            let indTotal = total >= 10 ? total : `0${total}`
            let indCurrent = current >= 10 ? current : `0${current}`
            return `<b>${indCurrent }</b><span></span>${indTotal}`
         }
      },
      scrollbar : {
         el : '.home-slider__scrollbar',
         draggable : true
      },
      navigation : {
         prevEl : '.home-slider__prev',
         nextEl : '.home-slider__next'
      },
      keyboard : {
         enabled : true,
         onlyInViewport : false
      },
      runCallbacksOnInit : true
   });

   // advantages-slider
   const advSlider = new Swiper('.advantages-slider', {
      effect : 'fade',
      speed : 1400,
      autoplay : {
         delay : 5000,
         disableOnInteraction : false,
      },
   });

   // our-blog-slider
   const ourBlogSlider = new Swiper('.our-blog-slider', {
      speed : 800,
      lazy: true,
      keyboard : {
         enabled : true,
         onlyInViewport : false
      },
      spaceBetween: 20,

      breakpoints: {
         768: {
            slidesPerView: 2,
         },
         992: {
            slidesPerView: 3,
         }
      },

      pagination: {
         el: '.our-blog-slider__pagination',
         clickable: true,
         bulletClass: 'our-blog-slider__bullet',
         bulletActiveClass: 'our-blog-slider__bullet-active',
       },
     
   });

   // одинаковая высота слайдов
   const wrapSlides = document.querySelector('.our-blog-slider__wrapper');
   const hWrapSlides = wrapSlides.clientHeight;
   wrapSlides.style.cssText += `--height: ${hWrapSlides}px`;


   //==================================================================================
   //=== Изменение разметки, чтобы не нужно было прописывать теги контент-менеджеру ===
   //==================================================================================
   const sliderHeadings = document.querySelectorAll('.home-slider__heading');
   Array.from(sliderHeadings).forEach((heading) => {
      let text  = heading.textContent.split(' '),
                  first = text.shift();
      heading.innerHTML = `${first} <br><span>${text.join(' ')}</span>`;
   })

   const homeCallbackLi = document.querySelectorAll('.home-callback__list li');
   Array.from(homeCallbackLi).forEach((li) => {
      li.innerHTML = li.textContent.replace(/([0-9]+)/g, '<span>$1</span>');
   });

   const advSliderCaption = document.querySelectorAll('.advantages-slider__caption');
   Array.from(advSliderCaption).forEach((item) => {
      let num = item.textContent.match(/([0-9]+)/g),
          text = item.textContent.match(/([а-я])+/gi);

      num = `<span>${num}</span>`;
      text[0] = `${text[0]}<br>`;
      text = text.join(' ');

      item.innerHTML = `${num}${text}`;
   });


});
