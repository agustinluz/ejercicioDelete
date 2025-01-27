import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Alumno } from '../modelo/Alumno';


@Injectable()

export class ApiServiceProvider {


private URL = "http://localhost:3000";


constructor(public http: HttpClient) {

}


getAlumnos(): Promise<Alumno[]> {

     let promise = new Promise<Alumno[]>((resolve, reject) => {

         this.http.get(this.URL + "/alumnos").toPromise()

             .then((data: any) => {

                 let alumnos = new Array<Alumno>();

                 data.forEach((alumno: Alumno) => {

                     console.log(alumno);

                     alumnos.push(alumno);

                 });

                 resolve(alumnos);

             })

             .catch((error: Error) => {

                 reject(error.message);

             });

     });

     return promise;

}//end_getAlumnos

getAlumnosPaginados(start: number, end: number): Promise<Alumno[]> {
    return new Promise<Alumno[]>((resolve, reject) => {
        this.http.get(`${this.URL}/alumnos?_start=${start}&_end=${end}&_sort=id`).toPromise()
            .then((data: any) => {
                let alumnos = new Array<Alumno>();
                console.log(`${this.URL}/alumnos?_start=${start}&_end=${end}`);
                data.forEach((alumno: Alumno) => {
                    alumnos.push(alumno);
                });
                resolve(alumnos);
               
            })
            .catch((error: Error) => {
                reject(error.message);
            });
    });
}


/*

Este método manda una solicitud de borrado a la Api del usuario con un id determinado.

Si el borrado va bien se sale son resolve devolviendo true.

Si el borrado va mal se sale con reject, devolviendo el mensaje de error que nos llega

*/



eliminarAlumno(id: number): Promise<Boolean> {

     let promise = new Promise<Boolean>((resolve, reject) => {

         this.http.delete(this.URL + "/alumnos/" + id).toPromise().then(

             (data: any) => { // Success

                 console.log(data)

                 resolve(true);

             }

         )

             .catch((error: Error) => {

                 console.log(error.message);

                 reject(error.message);

             });

     });

     return promise;

}//end_eliminar_alumno

eliminarTodo(): Promise<boolean> {
    return this.getAlumnos().then(alumnos => {
        const eliminarPromesas = (alumnos || []).map(alumno =>
            this.http.delete(`${this.URL}/alumnos/${alumno.id}`).toPromise()
        );
        return Promise.all(eliminarPromesas).then(() => true);
    });
} 


modificarAlumno(nuevosDatosAlumno: Alumno): Promise<Alumno> {
    let promise = new Promise <Alumno>((resolve, reject) => {
        var header = { "headers": { "Content-Type": "application/json" } };
        let datos = JSON.stringify(nuevosDatosAlumno);
        this.http.put(this.URL + "/alumnos/" + nuevosDatosAlumno.id,
            datos,
            header).toPromise().then(
                (data: any) => { // Success
                    let alumno: Alumno;
                    alumno = data;
                    resolve(alumno);
                }
            )
            .catch((error: Error) => {
                reject(error.message);
            });
    });
    return promise;
}//end_modificar_alumno

buscarAlumnosPorNombreApellido(nombre: string, apellido: string): Promise<Alumno[]> {

    return new Promise<Alumno[]>((resolve, reject) => {

        this.http.get(`${this.URL}/alumnos?first_name=${nombre}&last_name=${apellido}`).toPromise()

            .then((data: any) => {

                let alumnos = new Array<Alumno>();

                data.forEach((alumno: Alumno) => {

                    alumnos.push(alumno);

                });

                resolve(alumnos);

            })

            .catch((error: Error) => {

                reject(error.message);

            });

    });

}




}//end_class