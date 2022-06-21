####################################

PUNTOS A TENER EN CUENTA

Para que funcione el proyecto se necesita:
1. Se necesita tener la conexion MongoDB. Esto significa que hay que encender la maquina virtual y poner el IP externo en config/db.js. Hay que editar el url de la conexion.
2. Se necesita la el token de identidad. Este se consigue desde cloud, usando la comanda:     gcloud auth print-identity-token.
   El valor que te da hay que ponerlo en routes/userRoutes.js linea 23: let authorization = `...`
3. Se necesita el token de acceso a VertexAI. Se obtiene con la comanda     gcloud auth print-access-token
   Añadir token en routes/userRoutes.js linea 52 const predictionAuthorization = `Bearer TOKEN`
3.1 Hay que activar el extremo en Vertex AI, este contiene el modelo entrenado y el enlace para poder utilizar la llamada API.  


######################################

ESTRUCTURA DEL PROYECTO

    BACKEND

        /config
            db.js               # Conexion a la base de datos MongoDB. Leer punto 1 
        /controllers
            /userControllers.js # Las funciones principales que llamaremos desde el cliente.
                                # En este caso estan la de login y registro aqui, la de procesar imagen esta en userRoutes.js.
        /data
            /notes.js           # Es un dummy que teniamos para hacer la parte de mostrar el historial.
        
        /models
            /userModel.js       # Schemas de la base de datos que tenemos.
        /routes
            /useRoutes.js       # Son las rutas que enlazan las rutas con sus funciones de userController.
                                # En el caso de la ruta de la camara, esta la hacemos aqui.
        /utils                  
            generateToken.js    # Esto lo ibamos a usar para guardar una session del usuario, pero al final no se ha implementado.
        
        .env    #Variables de entorno

        server.js               #Aqui creamos el servidor y el enrutador, y controlamos el acceso de paginas, permitiendo solo localhost:3000

        package.json            #Las dependencias que usamos
        package-lock.json

    FRONTEND    #Explicaremos solo la carpeta /src, que contiene todos los ficheros que se han desarrollado

        /src

            /components         #Componentes independientes que hacen alguna funcion en concreto

            /sceens             #Las paginas que se mostraran.  Aqui juntamos los componentes necesarios para que cada pagina se muestre correctamente.



###################################

Modelo de clasificacion

Hemos utilizado los 4 arboles mas comunes en la UAB.
De cada arbol hemos utilizado aproximadamente 100 imagenes, por lo tanto tenemos aproximadamente 400 imagenes en nuestro conjunto de entrenamiento/test
No hemos usado conjuntos mas grandes por el hecho de que VertexAI consume mucho y nos estamos limitando a nuestro presupuesto de 300 dolares gratis en Google.