class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Rectangle {
  /**
   * Contructor de la clase Rectangle
   * @param {number} x cordenada x
   * @param {number} y cordenada y
   * @param {number} w ancho
   * @param {number} h alto
   */
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  /**
   * Funcion para verificar si esta dentro del rectangulo
   * @param {Point} point intancia de clase Point
   * @returns boolean
   */
  contains(point = new Point()) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    )
  }

  /**
   * Verificamos si los puntos no se sobreponen
   * @param {Point} range
   * @returns bool
   */
  intersects(range = new Point()) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    )
  }
}

class QuadTree {
  /**
   * Contructor de la clase QuadTree
   * @param {Rectangle} boundary - regiones en pixeles a crear cuando el numero de nodos hijos es alcanzado
   * @param {number} n numero -  maximo de nodos hijos
   */
  constructor(boundary, n) {
    this.boundary = boundary
    this.capacity = n
    this.points = [] // Almacenamiento para los nodos
    this.divided = false // Division del quadtree
  }

  /**
   * Funcion para subdividir quadtree en quadtree de menor dimension
   */
  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.w
    let h = this.boundary.h
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2)
    this.northeast = new QuadTree(ne, this.capacity)
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2)
    this.northwest = new QuadTree(nw, this.capacity)
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2)
    this.southeast = new QuadTree(se, this.capacity)
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2)
    this.southwest = new QuadTree(sw, this.capacity)
    this.divided = true
  }

  /**
   * Funcion para insertar nodos hijos y ser almacenado en el arreglo points
   * @param {Point} point -  instacia de la clase Point
   * @returns bool
   */
  insert(point) {
    // Si en el boundary "sub-quadtree" contiene el punto
    if (!this.boundary.contains(point)) {
      return false
    }
    if (this.points.length < this.capacity) {
      this.points.push(point)
      return true
    } else {
      if (!this.divided) {
        this.subdivide()
      }
      if (this.northeast.insert(point)) {
        return true
      } else if (this.northwest.insert(point)) {
        return true
      } else if (this.southeast.insert(point)) {
        return true
      } else if (this.southwest.insert(point)) {
        return true
      }
    }
  }

  /**
   * Obtener todos los puntos del quadtree o "boundary"
   * @returns  Array<number>
   */
  getAllPoints() {
    const pointsList = []
    this.getAllPointsRecursive(pointsList)
    return pointsList
  }

  /**
   * Obtener de manera recursiva los puntos los sub-quadtree o "sub-boundary"
   * @param {Array<number>} pointsList
   * @returns  void
   */
  getAllPointsRecursive(pointsList) {
    if (!this.divided) {
      Array.prototype.push.apply(pointsList, this.points.slice())
      return
    }

    this.northwest.getAllPointsRecursive(pointsList)
    this.northeast.getAllPointsRecursive(pointsList)
    this.southwest.getAllPointsRecursive(pointsList)
    this.southeast.getAllPointsRecursive(pointsList)
  }
  /**
   * Funcion recursiva para hacer una busqueda dado un range "quadtree o sub-quadtree" para encontrar los points dado un range
   * @param {Rectangle} range - instancia de la clase, quadtree y sub divisiones
   * @param {Array<number>} found - Arreglo para almacenar los points encontrados
   * @returns Array<number>
   */
  query(range, found) {
    if (!found) {
      found = []
    }
    if (!this.boundary.intersects(range)) {
      return
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p)
        }
      }
      /* Busqueda recursiva en sub-quadtrees */
      if (this.divided) {
        this.northwest.query(range, found)
        this.northeast.query(range, found)
        this.southwest.query(range, found)
        this.southeast.query(range, found)
      }
    }
    return found
  }

  /**
   * Funcion para limpiar los points y divisiones generados
   */
  clear() {
    this.points = []
    if (this.divided) {
      this.northwest.clear()
      this.northeast.clear()
      this.southwest.clear()
      this.southeast.clear()
    }
    this.divided = false
  }

  /**
   *  Funcion para mostrar quadtree "boundary" , sus subqueadtree ademas de puntos
   */
  show() {
    stroke(255)
    noFill()
    strokeWeight(1)
    rectMode(CENTER)
    rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.w * 2,
      this.boundary.h * 2
    )
    for (let p of this.points) {
      strokeWeight(2)
      point(p.x, p.y)
    }

    if (this.divided) {
      this.northeast.show()
      this.northwest.show()
      this.southeast.show()
      this.southwest.show()
    }
  }
}
