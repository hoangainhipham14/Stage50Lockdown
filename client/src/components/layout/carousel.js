import React, { Component } from "react";

export default class Home extends Component {
  componentDidMount() {
    const track = document.querySelector(".carousel__track");
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".carousel__leftbutton");
    const prevButton = document.querySelector(".carousel__rightbutton");
    const navIndicator = document.querySelector(".carousel__nav");
    const dots = Array.from(navIndicator.children);

    // const slideWidth = slides[0].getBoundingClientRect().width;
    const slideWidth = 600;

    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + "px";
      slide.style.amountToSlide = slideWidth * index + "px";
    };

    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
      track.style.transform =
        "translate(-" + targetSlide.style.amountToSlide + ")";

      currentSlide.classList.remove("current-slide");
      targetSlide.classList.add("current-slide");
    };

    const updateDots = (currentDot, targetDot) => {
      currentDot.classList.remove("current-slide");
      targetDot.classList.add("current-slide");
    };

    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
      if (targetIndex === 0) {
        prevButton.classList.add("is-hidden");
        nextButton.classList.remove("is-hidden");
      } else if (targetIndex === slides.length - 1) {
        prevButton.classList.remove("is-hidden");
        nextButton.classList.add("is-hidden");
      } else {
        prevButton.classList.remove("is-hidden");
        nextButton.classList.remove("is-hidden");
      }
    };

    nextButton.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current-slide");
      const prevSlide = currentSlide.previousElementSibling;
      const currentDot = navIndicator.querySelector(".current-slide");
      const prevDot = currentDot.previousElementSibling;
      const prevIndex = slides.findIndex((slide) => slide === prevSlide);
      const targetSlide = slides[prevIndex];

      moveToSlide(track, currentSlide, targetSlide);
      updateDots(currentDot, prevDot);
      hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });

    prevButton.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current-slide");
      const nextSlide = currentSlide.nextElementSibling;
      const currentDot = navIndicator.querySelector(".current-slide");
      const nextDot = currentDot.nextElementSibling;
      const nextIndex = slides.findIndex((slide) => slide === nextSlide);
      const targetSlide = slides[nextIndex];

      moveToSlide(track, currentSlide, targetSlide);
      updateDots(currentDot, nextDot);
      hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });

    navIndicator.addEventListener("click", (e) => {
      const targetDot = e.target.closest("button");

      if (!targetDot) return;

      const currentSlide = track.querySelector(".current-slide");
      const currentDot = navIndicator.querySelector(".current-slide");
      const targetIndex = dots.findIndex((dot) => dot === targetDot);
      const targetSlide = slides[targetIndex];

      moveToSlide(track, currentSlide, targetSlide);
      updateDots(currentDot, targetDot);
      hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });
  }

  render() {
    return (
      <div class="carousel">
        <button class="carousel__button carousel__leftbutton is-hidden">
          <img src="leftarrow.png" alt=""></img>
        </button>

        <div class="carousel__track-container">
          <ul class="carousel__track">
            <div class="carousel__slide current-slide">
              <img
                class="carousel__image"
                src="anywhere-door.png"
                alt="anywhere-door"
              ></img>
            </div>
            <div class="carousel__slide">
              <img
                class="carousel__image"
                src="copying-toast.png"
                alt="copying-toast"
              ></img>
            </div>
            <li class="carousel__slide">
              <img
                class="carousel__image"
                src="take-copter.jpg"
                alt="take-copter"
              ></img>
            </li>
          </ul>
        </div>

        <button class="carousel__button carousel__rightbutton">
          <img src="rightarrow.png" alt=""></img>
        </button>

        <div class="carousel__nav">
          <button class="carousel__indicator current-slide"></button>
          <button class="carousel__indicator"></button>
          <button class="carousel__indicator"></button>
        </div>
      </div>
    );
  }
}
