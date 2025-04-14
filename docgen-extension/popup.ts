document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("theme-button")
  const list = document.getElementById("theme")

  if (button && list) {
    button.addEventListener("click", () => {
      list.classList.toggle("hidden")
    })
  }
})
