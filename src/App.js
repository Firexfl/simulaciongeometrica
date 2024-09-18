import React, { useEffect, useRef } from "react";
import p5 from "p5"; //Importamos la biblioteca que nos ayudara a dibujar las formas geométricas

const App = () => {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null); // Guardamos la instancia de p5.js aquí

  useEffect(() => {
    const sketch = (p) => { //Asociación a canvas
      let shapes = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight); //canvas se ajusta al tamaño del navegador
        for (let i = 0; i < 10; i++) {
          shapes.push(new Shape(p.random(p.width), p.random(p.height / 2), p));
        }
      };

      p.draw = () => {
        p.background(255);
        for (let shape of shapes) {
          shape.update();
          shape.display();
        }
      };

      class Shape {
        constructor(x, y, p) {
          this.x = x; // Coordenada x de la forma.
          this.y = y; // Coordenada y de la forma.
          this.p = p; // Referencia al objeto p5.js.
          this.size = p.random(30, 50); // Tamaño de la forma, aleatorio entre 30 y 50 píxeles.
          this.ySpeed = 0; // Velocidad vertical de la forma.
          this.gravity = 0.5; // La fuerza de la gravedad.
          this.lift = -10; // Fuerza hacia arriba cuando el usuario mantiene presionado el mouse.
          this.isClicked = false; // Bandera para saber si se está haciendo clic sobre la forma.
          this.shapeType = p.random(["circle", "square", "triangle"]); // Tipo de forma, aleatorio entre círculo, cuadrado o triángulo.
          // Asignamos un color aleatorio a cada figura
          this.color = [p.random(255), p.random(255), p.random(255)];
        }

        update() {
          if (!this.isClicked) {
            this.ySpeed += this.gravity; // Si no está siendo presionada, la gravedad aumenta la velocidad
          } else {
            this.ySpeed += this.lift; // Si está siendo presionada, la forma sube
          }

          this.y += this.ySpeed; // Actualizar la posición vertical

          // Limitar la posición al suelo
          if (this.y > this.p.height - this.size / 2) {
            this.y = this.p.height - this.size / 2;
            this.ySpeed = 0;// Detener la velocidad al llegar al suelo
          }

          // Limitar la posición al techo
          if (this.y < 0) {
            this.y = 0;
            this.ySpeed = 0;// Detener la velocidad al llegar al límite superior
            this.isClicked = false;// Reiniciar el estado de clic
          }
        }

        display() {
          this.p.fill(this.color); //para aplicar el color a cada forma antes de dibujarla.
          // Dibujar la forma dependiendo de su tipo
          if (this.shapeType === "circle") {
            this.p.ellipse(this.x, this.y, this.size);// Dibujar un círculo

          } else if (this.shapeType === "square") {
            this.p.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);// Dibujar un cuadrado
          } else if (this.shapeType === "triangle") {
            this.p.triangle(
              this.x - this.size / 2, this.y + this.size / 2,
              this.x + this.size / 2, this.y + this.size / 2,
              this.x, this.y - this.size / 2); // Dibujar un triángulo
          }
        }

        pressed() {
          // Detectar si el mouse está dentro de los límites de la forma
          if (this.p.mouseX > this.x - this.size / 2 &&
              this.p.mouseX < this.x + this.size / 2 &&
              this.p.mouseY > this.y - this.size / 2 &&
              this.p.mouseY < this.y + this.size / 2) {
            this.isClicked = true; // Si el mouse está dentro de la forma, activar el click
          }
        }

        released() {
          this.isClicked = false; // Cuando se suelta el mouse, detener la aceleración hacia arriba

        }
      }

      // Detectar el clic del mouse
      p.mousePressed = () => {
        for (let shape of shapes) {
          shape.pressed(); // Verificar si alguna forma ha sido presionada
        }
      };

      // Detectar cuándo se suelta el botón del mouse
      p.mouseReleased = () => {
        for (let shape of shapes) {
          shape.released(); // Verificar cuándo se suelta el botón del mouse
        }
      };
    };

    // Solo creamos una instancia de p5 si no existe aún
    if (!p5Instance.current) {
      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    // Limpiamos la instancia de p5.js cuando el componente se desmonte
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove(); // Este método elimina el canvas y la instancia de p5
        p5Instance.current = null; // Reseteamos la referencia
      }
    };
  }, []);

  return <div ref={sketchRef} />;


};

export default App;
