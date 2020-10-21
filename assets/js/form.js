var checkForm = function(e)
{
  var form = (e.target) ? e.target : e.srcElement;
  if(form.name.value == "") {
    alert("Please enter your Name");
    form.name.focus();
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return;
  }
  if(form.city.value == "") {
    alert("Please enter your City");
    form.city.focus();
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return;
  }
}

var modal_init = function() 
{
    var modalWrapper = document.getElementById("modal_wrapper");
    var modalWindow  = document.getElementById("modal_window");
    var openModal = function(e)
    {
      modalWrapper.className = "overlay";
      var overflow = modalWindow.offsetHeight - document.documentElement.clientHeight;
      if(overflow > 0) {
        modalWindow.style.maxHeight = (parseInt(window.getComputedStyle(modalWindow).height) - overflow) + "px";
      }
      modalWindow.style.marginTop = (-modalWindow.offsetHeight)/2 + "px";
      modalWindow.style.marginLeft = (-modalWindow.offsetWidth)/2 + "px";
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    var closeModal = function(e)
    {
      modalWrapper.className = " ";
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    var clickHandler = function(e) 
    {
      if(!e.target) e.target = e.srcElement;
      if(e.target.tagName == "DIV") {
        if(e.target.id != "modal_window") closeModal(e);
      }
    }

    var keyHandler = function(e) {
      if(e.keyCode == 27) closeModal(e);
    }

    if(document.addEventListener) {
      document.getElementById("modal_open").addEventListener("click", openModal, false);
      document.getElementById("modal_close").addEventListener("click", closeModal, false);
      document.addEventListener("click", clickHandler, false);
      document.addEventListener("keydown", keyHandler, false);
    } 
    else {
      document.getElementById("modal_open").attachEvent("onclick", openModal);
      document.getElementById("modal_close").attachEvent("onclick", closeModal);
      document.attachEvent("onclick", clickHandler);
      document.attachEvent("onkeydown", keyHandler);
    }

    openModal();
  }

  if(document.addEventListener) {
    document.getElementById("modal_form").addEventListener("submit", checkForm, false);
    document.addEventListener("DOMContentLoaded", modal_init, false);
  } 
  else {
    document.getElementById("modal_form").attachEvent("onsubmit", checkForm);
    window.attachEvent("onload", modal_init);
  }

localStorage.setItem('name', "");
localStorage.setItem('city', "");