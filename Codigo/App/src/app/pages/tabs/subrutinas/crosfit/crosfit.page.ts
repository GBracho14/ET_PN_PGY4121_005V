import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { exercices } from 'src/app/models/exercices.models';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crosfit',
  templateUrl: './crosfit.page.html',
  styleUrls: ['./crosfit.page.scss'],
})
export class CrosfitPage implements OnInit {

  exercices: exercices[] = [];
  user = {} as User;
  filteredExercices: exercices[] = [];
  isModalOpen = false;
  inputEnabled: boolean;
  exerciceId: string;
  exerciceForm: FormGroup;

  constructor(
    private firebaseSrv: FirebaseService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.getExercices();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user') || {} as User;
  }

  getExercices() {
    const path = `user/${this.user.uid}`;
    this.firebaseSrv.getSubcollection(path, 'exercices').subscribe({
      next: (res: exercices[]) => {
        console.log(res);
        this.exercices = res;

        // Filtrar ejercicios por CROSSFIT
        this.filteredExercices = this.filterExercicesByCrossfit(this.exercices);
      }
    });
  }

  // Filtrar Ejercicios por CROSSFIT
  filterExercicesByCrossfit(exercices: exercices[]): exercices[] {
    return exercices.filter(
      (exercise) =>
        exercise.class_exercice.toUpperCase() === 'CROSSFIT'
    );
  }
}

