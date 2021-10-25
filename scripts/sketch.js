let qtree,
  showRec = 0
function setup() {
  const box = createCanvas(500, 500)
  box.parent('box')
  let boundary = new Rectangle(250, 250, 250, 250)

  qtree = new QuadTree(boundary, 4) // Crear un quadtree con un boundary de 250px y 4 puntos como maximo

  slider = createSlider(1, 10, 3)
  slider.parent('slider_one')
  slider.style('width', '200px')
  slider.style('label', 'How')

  slider2 = createSlider(25, 50, 25)
  slider2.parent('slider_two')
  slider2.style('width', '200px')
  slider2.style('label', 'How')
}

function draw() {
  fill(255)
  rectMode(CENTER)
  stroke(255)
  rect(300, 300, 600, 600)
  fill('rgba(100%,0%,100%,0.5)')
  rectMode(CENTER)
  rect(250, 250, 500, 500)
  qtree.show()
  stroke(0, 255, 0)
  rectMode(CENTER)
  let sz = slider2.value()
  let range = new Rectangle(mouseX, mouseY, sz, sz)
  let pts = 0

  if (mouseIsPressed && insideRect()) {
    let val = slider.value()
    for (let id = 0; id < val; id++) {
      let x = randomGaussian(-5, +5)
      let y = randomGaussian(-5, +5)
      let m = new Point(mouseX + x, mouseY + y)
      qtree.insert(m)
    }
    for (let delay = 0; delay < 1000; ) {
      delay++
    }
  }
  if (showRec == 1) {
    if (mouseX < 500 && mouseY < 500) {
      rect(range.x, range.y, range.w * 2, range.h * 2)
      const points = qtree.query(range)
      for (let p of points) {
        strokeWeight(4)
        point(p.x, p.y)
      }
      pts = points.length
      textSize(20)
      const sentence = 'Hay ' + pts + ' puntos totales dentro del cuadro'
      fill(0)
      text(sentence, 10, 60)
      const sentence2 =
        'Hay ' + qtree.getAllPoints().length + ' puntos totales '
      fill(0)
      text(sentence2, 10, 80)
    }
  }
}

function CountInRange() {
  showRec = 1 - showRec
}

function ClearButton() {
  qtree.clear()
}

function RandomPoints() {
  qtree.clear()
  for (let i = 0; i < 110; i++) {
    let x = randomGaussian(500 / 2, 500 / 8)
    let y = randomGaussian(500 / 2, 500 / 8)
    let p = new Point(x, y)
    qtree.insert(p)
  }
}

function insideRect() {
  const x = mouseX,
    y = mouseY
  return x >= 0 && x <= 600 && y >= 0 && y < 600
}
