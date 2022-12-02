// Conexión a servidor de backend.py
var location2 = "";
var baseURL = "http://localhost:5000"
const dx = -50;
const dy = -50;

fetch(baseURL + "/", {
  method: "POST"
}).then(response => {
    console.log("Todo bien")
});

// Creación de Escena
const scene = new THREE.Scene();

// Creacion de Camara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,2000);
camera.position.set(-60, 12, -60);

//AmbienLight general /TO DO/
const light = new THREE.AmbientLight(0x404040, 15); // soft white light
scene.add(light);

//render
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Movilidad de escenario
const controls = new THREE.OrbitControls(camera, renderer.domElement);
  

function createCar(carros){
    for (var i = 0; i < carros.length; i++) {
        // let cube = new THREE.BoxGeometry(0.75, 0.75, 0.75);
        // let material = new THREE.MeshBasicMaterial({ color: 0x7c3222 });
        // let car = new THREE.Mesh(cube, material);
        var car = drawCar();
        // select the Y world axis
        const myAxis = new THREE.Vector3(0, 1, 0);
        if (carros[i].north && !carros[i].horizontal){
            // rotate the mesh 90 on this axis
            car.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(90));
        }
        if (!carros[i].north && !carros[i].horizontal){
            // select the Z world axis
            // rotate the mesh 270 on this axis
            car.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(270));
        }
        if (!carros[i].east && carros[i].horizontal){
            // rotate the mesh 180 on this axis
            car.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(180));
        }
        scene.add(car);
        car.name = 'car' + i.toString();
        car.position.y = 1;
        car.position.z = carros[i].pos[1] + dy;
        car.position.x = carros[i].pos[0] + dx;
    }
}

function createSemaros(semaforos){
    const myAxis = new THREE.Vector3(0, 1, 0);

    for (var i = 0; i < semaforos.length; i++) {
        var poste = drawTlight();
        let material1;
        let sphere = new THREE.SphereGeometry(0.5, 32, 16);
        if(semaforos[i].estatus){
            material1 = new THREE.MeshBasicMaterial({ color: 0x357a38});
        }
        else{
            material1 = new THREE.MeshBasicMaterial({ color: 0xff0000});
        }
        let semaforo = new THREE.Mesh(sphere, material1);
        semaforo.position.y = 3.5;
        semaforo.position.z = semaforos[i].pos[1] + dy;
        semaforo.position.x = semaforos[i].pos[0] + dx;
        scene.add(semaforo);
        poste.position.y = 2;
        if(semaforos[i].pos[0] == 8 && semaforos[i].pos[1] == 13.5){
            poste.position.z = semaforos[i].pos[1] + dy + 2.5;
            poste.position.x = semaforos[i].pos[0] + dx;
            poste.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(90));
        }
        if(semaforos[i].pos[0] == 10.5 && semaforos[i].pos[1] == 8){
            poste.position.z = semaforos[i].pos[1] + dy;
            poste.position.x = semaforos[i].pos[0] + dx - 2.5;
        }
        if(semaforos[i].pos[0] == 13.5 && semaforos[i].pos[1] == 16){
            poste.position.z = semaforos[i].pos[1] + dy;
            poste.position.x = semaforos[i].pos[0] + dx + 2.5;
            poste.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(180));
        }
        if(semaforos[i].pos[0] == 16 && semaforos[i].pos[1] == 10.5){
            poste.position.z = semaforos[i].pos[1] + dy - 2.5;
            poste.position.x = semaforos[i].pos[0] + dx;
            poste.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(270));
        }
        scene.add(poste);
    }  
}

function createBosque(x, y, z){
    let tmp = z;
    for(var i=0; i < 4 ; i++){
        for(var j=0; j< 3; j++){
            var tree = drawTree();
            tree.position.set(x, y, z);
            tree.scale.set(0.5, 0.5, 0.5)
            scene.add(tree);
            z += 2
        }
        x += 2
        if(i < 1){
            z = tmp - 1;
        }else{
            z = tmp + 1;
        }
        tmp = z;
    }
}

function createBench(x, y, z){
    const myAxis = new THREE.Vector3(0, 1, 0);
    for (var i = 0; i< 2; i++){
        for(var j=0 ; j < 2 ; j++){
            var bench = drawBench();
            bench.position.set(x, y, z);
            bench.scale.set(0.4, 0.4, 0.4);
            if(i == 1){
                if(j == 0){
                    x -= 1;
                }
                bench.rotateOnAxis(myAxis,300);
                bench.position.z = z;
                bench.position.x = x;
                x -= 2;
            }else{
                z += 2;
            }
            scene.add(bench);
        }
    }
}

function createFountain(x, y, z){
    var fountain = drawFountain();
    fountain.position.set(x, y, z);
    fountain.scale.set(0.5,0.5,0.5);
    scene.add(fountain);
}




function plano(scene){
    let geometry = new THREE.BoxGeometry(25, 0.2, 25);
    let material = new THREE.MeshStandardMaterial({color: 0x2C2F4F});
    let material2= new THREE.MeshStandardMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(geometry, material);
    let geometry2 = new THREE.BoxGeometry(7, 0.2, 25);
    const calle1 = new THREE.Mesh(geometry2, material2);
    let geometry3 = new THREE.BoxGeometry(25, 0.2, 7);
    const calle2 = new THREE.Mesh(geometry3, material2);

    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);
    scene.add(calle1);
    scene.add(calle2);
    plane.position.set(-37, 0.4, -37)
    calle1.position.set(-38,.5,-37)
    calle2.position.set(-37,.5,-38)
    scene.add(light);
}

function drawTlight(){
    const myAxis = new THREE.Vector3(0, 0, 1);

    const tlight = new THREE.Group();

    const geometry = new THREE.CylinderGeometry(0.2,0.2,3,32); //  Radio up, radio down, height, radialsegment
    const geometry2 = new THREE.CylinderGeometry(0.2,0.2,2.5,32); //  Radio up, radio down, height, radialsegment
    
    const material = new THREE.MeshLambertMaterial({ color: 0x2F2F30 });
    const pole1    = new THREE.Mesh(geometry,material);
    // pole1.position.set(8,2,-42);
    tlight.add(pole1);       

    const pole2    = new THREE.Mesh(geometry2,material);
    // pole2.position.set(8.84,3.5,-42);
    pole2.position.y = 1.6;
    pole2.position.x = 1.07;

    pole2.rotateOnWorldAxis(myAxis, THREE.MathUtils.degToRad(270));
    tlight.add(pole2);   
    

    // scene.add(tlight);
    return tlight;

}

function drawCar(){
    const car = new THREE.Group();

    const geometry = new THREE.BoxGeometry(11, 11, 33);
    const material = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const backWheel = new THREE.Mesh(geometry, material);
    backWheel.position.y = 6;
    backWheel.position.x = -16;
    car.add(backWheel)

    const geometry1 = new THREE.BoxGeometry(11, 11, 33);
    // const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frontWheel = new THREE.Mesh(geometry1, material);
    frontWheel.position.y = 6;  
    frontWheel.position.x = 16;
    car.add(frontWheel)
    
    const cube = new THREE.BoxGeometry(50, 15, 30);
    const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 })
    const cuerpo = new THREE.Mesh(cube, mat);
    cuerpo.position.y = 12;
    car.add(cuerpo)

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(30, 12, 24),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);
    
    car.scale.set(.033,.039,.039)
    // car.position.set(dx, 0, dy)
    // scene.add(car)
    return car;
}

function drawTree(){
    const tree = new THREE.Group();
    // Para dibujar el tronco
    const geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x804000});
    const tronco = new THREE.Mesh(geometry, material);
    // tronco.position.y = 6;
    // tronco.position.x = -16;
    tree.add(tronco);

    // Para dibujar las hojas
    const geometry1 = new THREE.ConeGeometry(1.3, 3, 10);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x357a38});
    const hojas = new THREE.Mesh(geometry1, material1);
    hojas.position.y = 2;
    tree.add(hojas);

    return tree;
    // Añadir arbol completo
    // scene.add(tree);
}

function drawFountain(){
    const myAxis = new THREE.Vector3(0, 0, 1);

    const fountain = new THREE.Group();
    // Para dibujar la base
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080});
    const base = new THREE.Mesh(geometry, material);

    fountain.add(base);

    // Para dibujar pedestal
    const geometry1 = new THREE.CylinderGeometry(0.5, 0.5, 1.5);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x000000});
    const pedestal = new THREE.Mesh(geometry1, material1);
    pedestal.position.y = 0.7;
    
    fountain.add(pedestal);

    // Parte superior
    const geometry2 = new THREE.SphereGeometry(1.5, 32, 32);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x9FE7F5 });
    const bola = new THREE.Mesh(geometry2, material2);
    bola.position.y = 2;
    bola.rotateOnAxis(myAxis, 110);

    fountain.add(bola);
    
    return fountain;
}

function drawBench(){
    const bench = new THREE.Group();
    // Para dibujar las patas
    const geometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x804000});

    for(var i=0; i<2; i++){
        for(var j = 0; j < 2; j++){
            const pata = new THREE.Mesh(geometry, material);
            pata.position.x = i + 0.3;
            bench.add(pata);
            if (j == 1){
                pata.position.z = j * 3;
            }
            if (i == 1){
                pata.position.x = i - 0.2;
            }            
        }   
    }
    

    // Para dibujar el asiento
    const geometry1 = new THREE.BoxGeometry(1, 0.2, 4);
    const material1= new THREE.MeshBasicMaterial({ color: 0x804000});
    const asiento = new THREE.Mesh(geometry1, material1);
    asiento.position.x = 0.6;
    asiento.position.y = 0.3;
    asiento.position.z = 1.5;

    bench.add(asiento);

    // Para dibujar el respaldo
    const myAxis = new THREE.Vector3(0, 0, 1);

    const geometry2 = new THREE.BoxGeometry(0.2, 0.7, 4);
    const material2= new THREE.MeshBasicMaterial({ color: 0x804000});
    const respaldo = new THREE.Mesh(geometry2, material2);
    respaldo.position.x = 1.1;
    respaldo.position.y = 0.85;
    respaldo.position.z = 1.5;
    respaldo.rotateOnAxis(myAxis, 270)

    bench.add(respaldo);

    return bench;
}


// Driver
const frame_rate = 200; // Refresh screen every 200 ms
var previous_time = Date.now();


// Crear piso
plano(scene);
// Bosque de la izquierda
createBosque(-32.5, 1, -48);
// Bosque de la derecha
createBosque(-49, 1, -32);
// Crear bancas enfrente
createBench(-44, 0.6, -48);
// Crear bancas atras
createBench(-27, 0.6, -31);
// Crear fuente enfrente
createFountain(-46, 0.6, -46);
// Crear fuente atras
createFountain(-29, 0.6, -29);


var render = async function () {
    var now, elapsed_time;
    now = Date.now();
    elapsed_time = now - previous_time;

    if (elapsed_time >= frame_rate) {
        scene.remove(scene.getObjectByName('car0'));
        scene.remove(scene.getObjectByName('car1'));
        scene.remove(scene.getObjectByName('car2'));
        scene.remove(scene.getObjectByName('car3'));

        var res = await fetch(baseURL + "/step");
        // Return de los objetos en traffic
        var {carros, semaforos} = await res.json(); 
        previous_time = now;

        // Carros
        createCar(carros);
        // Semáforos
        createSemaros(semaforos);
        
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();