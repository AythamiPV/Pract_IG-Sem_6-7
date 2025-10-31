# Sistema Solar 3D Interactivo

Este proyecto es una **simulación 3D del Sistema Solar** utilizando **Three.js**, donde puedes explorar los planetas, sus lunas y cinturones de asteroides con **cámaras libres y fijas**, además de activar o detener las órbitas de los cuerpos celestes.

🔗 **Enlace al proyecto en CodeSandbox:** [CodeSandbox](https://codesandbox.io/p/sandbox/ig2526-s6-forked-5cykpl)

---

## Video de Presentación

Mira el video de presentación de este proyecto:

[Video](https://alumnosulpgc-my.sharepoint.com/:v:/g/personal/aythami_perez109_alu_ulpgc_es/EaJdAqoCwrpOiwhg8_Ac9p4Bdp7CsNBP9tdlfNZwkE1LZw?e=BrDNAB&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

---

## Características

- Visualización de **todos los planetas del Sistema Solar**: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.  
- **Lunas principales** de cada planeta (por ejemplo, la Luna, Ío, Europa, Titán…).  
- **Rotación sobre su propio eje** de planetas y lunas, con opción de **rotación retrógrada** en Venus.  
- **Órbitas elípticas** visibles para cada planeta y luna.  
- **Cinturones de asteroides**: cinturón principal entre Marte y Júpiter, y cinturón exterior alrededor de Neptuno.  
- **Anillos planetarios** para Saturno, Urano y Neptuno.  
- **Atmósferas transparentes** en Venus y Tierra.  
- **Luces y sombras realistas**: luz del Sol fija en el centro del sistema.  
- **Cámaras múltiples**:
  - **Cámara libre**: permite volar por el espacio con **FlyControls**.  
  - **Cámara fija**: visión estática con posibilidad de rotar y hacer zoom con **OrbitControls**.  
- **Interacción dinámica**:
  - Botón para **detener o activar las órbitas**.  
  - Botón para **cambiar entre cámara libre y cámara fija**.  

---

## Controles de la Cámara Libre (FlyControls)

- **Movimiento horizontal**: W, A, S, D  
- **Movimiento vertical**: R (subir), F (bajar)  
- **Rotación**: clic y arrastrar el ratón  

## Controles de la Cámara Fija (OrbitControls)

- **Rotación**: clic y arrastrar el ratón  
- **Zoom**: rueda del ratón  

---

## Tecnologías Utilizadas

- Three.js – Motor de gráficos 3D en JavaScript.  
- FlyControls – Para la cámara libre y vuelo por el espacio.  
- OrbitControls – Para cámara fija con rotación y zoom.  
- HTML, CSS y JavaScript moderno (ES6 Modules).  

---

## Estructura del Proyecto

├── src/

│ ├── index.html # Estructura base y header de controles

│ ├── styles.css # Estilos del canvas y header fijo

│ └── script.js # Lógica de Three.js, planetas y animaciones

└── textures/ # Texturas para planetas, lunas, anillos y fondo


---

## Cómo usar

1. Abre el proyecto en tu navegador desde CodeSandbox: [CodeSandbox](https://codesandbox.io/p/sandbox/ig2526-s6-forked-5cykpl)
2. Explora el Sistema Solar con la cámara libre o fija.  
3. Usa los botones del header para:
   - **Detener/activar órbitas**.  
   - **Cambiar entre cámara libre y fija**.  
