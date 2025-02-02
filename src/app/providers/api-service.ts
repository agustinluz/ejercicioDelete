import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alumno } from '../modelo/Alumno';
@Injectable()
export class ApiServiceProvider {
private URL = "http://localhost:3000";
constructor(public http: HttpClient) {}
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
}
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
eliminarAlumno(id: number): Promise<Boolean> {
     let promise = new Promise<Boolean>((resolve, reject) => {
         this.http.delete(this.URL + "/alumnos/" + id).toPromise().then(
             (data: any) => { // Success
                 console.log(data)
                 resolve(true);
             })
             .catch((error: Error) => {
                 console.log(error.message);
                 reject(error.message);
             });
     });
     return promise;
}

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
}

buscarAlumnosPorNombreApellido(nombre: string, apellido: string, ciudad: string): Promise<Alumno[]> {
    return new Promise<Alumno[]>((resolve, reject) => {
      this.http.get(`${this.URL}/alumnos`).toPromise()
        .then((data: any) => {
          const nombreMin = nombre ? nombre.toLowerCase() : '';
          const apellidoMin = apellido ? apellido.toLowerCase() : '';
          const ciudadMin = ciudad ? ciudad.toLowerCase() : '';
  
          const alumnos = data.filter((alumno: Alumno) => {
            return (
              (nombreMin && alumno.first_name.toLowerCase().includes(nombreMin)) ||
              (apellidoMin && alumno.last_name.toLowerCase().includes(apellidoMin)) ||
              (ciudadMin && alumno.city.toLowerCase().includes(ciudadMin))
            );
          });  
          resolve(alumnos);
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
  }
}