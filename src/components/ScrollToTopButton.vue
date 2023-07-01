<template>
    <div v-show="showButton" class="scroll-to-top" @click="scrollToTop">
      <span class="arrow-up">&uarr;</span>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showButton: false,
      };
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.showButton = scrollTop > 300;
      },
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      },
    },
  };
  </script>
  
 
  <style>
    .scroll-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background-color: #333;
      color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }
    
    .scroll-to-top:hover {
      opacity: 1;
    }
    
    .arrow-up {
      font-size: 20px;
    }
    
    /* Responsive Styles */
    
    @media (max-width: 480px) {
      .scroll-to-top {
        bottom: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        font-size: 16px;
      }
    }
    </style>