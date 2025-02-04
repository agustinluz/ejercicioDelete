import { Component, OnInit } from '@angular/core';
import { ApiServiceProvider } from '../providers/api-service';
import { Alumno } from '../modelo/Alumno';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SearchModalPage } from '../search-modal/search-modal.page';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  public alumnos = new Array<Alumno>();
  public currentPage = 1;
  public pageSize = 10;
  public totalAlumnos= new Array<Alumno>();
  public hasMorePages = true;

  constructor(private apiService: ApiServiceProvider,

    public alertController: AlertController,
    private modalCtrl: ModalController,
     private http: HttpClient) {

  }  

  ngOnInit(): void {
    this.loadAlumnos();
  }
 
  loadAlumnos() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.apiService.getAlumnosPaginados(start, end).then((data) => {
      this.alumnos = data;
      this.hasMorePages = data.length === this.pageSize;
    });
  }

  desfiltrar() {
    this.currentPage = 1;
    this.loadAlumnos();
  }
      goToFirstPage(): void {
        this.currentPage = 1;
        this.loadAlumnos();
      } 
      goToPreviousPage(): void {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadAlumnos();
        }
      }
      goToNextPage(): void {
        this.currentPage++;
        this.loadAlumnos();
      }
      goToLastPage(): void {
        console.log(this.totalAlumnos.length);
        console.log(this.pageSize);
        this.currentPage = Math.ceil( this.totalAlumnos.length / this.pageSize );
        this.loadAlumnos();
      }

  async modificarAlumno(indice: number) {
    let alumno = this.alumnos[indice];
    const alert = await this.alertController.create({
      header: 'Modificar',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: alumno.first_name,
          placeholder: 'first_name'
        },
        {
          name: 'last_name',
          type: 'text',
          id: 'last_name',
          value: alumno.last_name,
          placeholder: 'last_name'
        },
        {
          name: 'email',
          id: 'email',
          type: 'text',
          value: alumno.email,
          placeholder: 'email'
        },
        {
          name: 'gender',
          id: 'gender',
          type: 'text',
          value: alumno.gender,
          placeholder: 'gender'
        },
        {
          name: 'avatar',
          value: alumno.avatar,
          type: 'url',
          placeholder: 'avatar'
        },
        {
          name: 'address',
          value: alumno.address,
          type: 'text',
          placeholder: 'address'
        },
        {
          name: 'city',
          value: alumno.city,
          type: 'text',
          placeholder: 'city'
        },
        {
          name: 'postalCode',
          value: alumno.postalCode,
          type: 'text',
          placeholder: 'postalCode'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            var alumnoModificado: Alumno = new Alumno(
              alumno.id,
              data['gender'],
              data['first_name'],
              data['last_name'],
              data['email'],
              data['avatar'],
              data['address'],
              data['city'],
              data['postalCode']);
            this.apiService.modificarAlumno(alumnoModificado)
              .then((alumno: Alumno) => {
                this.alumnos[indice] = alumno;
              })
              .catch((error: string) => {
                console.log(error);
              });
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
  }//end_modificarAlumno
  eliminarAlumno(indice: number) {
    this.apiService.eliminarAlumno(this.alumnos[indice].id)
      .then((correcto: Boolean) => {
        console.log("Borrado correcto del alumno con indice: " + indice);
        this.alumnos.splice(indice, 1);
      })
      .catch((error: string) => {
        console.log("Error al borrar: " + error);
      });

  }//end_eliminar_alumno
  async eliminarTodosLosAlumnos() {
    const alert = await this.alertController.create({
        header: 'Eliminar todos los alumnos',
        message: '¿Estás seguro de que deseas eliminar todos los alumnos?',
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary'
            },
            {
                text: 'Confirmar',
                handler: () => {
                    this.apiService.eliminarTodo()
                        .then((correcto: Boolean) => {
                            this.alumnos = [];  
                        })
                }
            }
        ]
    });

    await alert.present();
}
async abrirModalBusqueda() {
  const modal = await this.modalCtrl.create({
    component: SearchModalPage,
  });
  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data) {
    const { firstName, lastName , city } = data;
    this.buscarAlumnos(firstName, lastName, city);
  }
}

buscarAlumnos(nombre: string, apellido: string, ciudad: string) {
  this.apiService.buscarAlumnosPorNombreApellido(nombre, apellido, ciudad).then((data) => {
    this.alumnos = data;
    this.currentPage = 1;
  });
}
}