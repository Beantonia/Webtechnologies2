import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { AppService } from '../app.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  Game: any = [];
  user = new User();
  uname: string;

  pieChartData: number[] = [];
  pieChartLabels: string[] = [];
  pieChartType: string = 'pie';
  pieChartColors: any[] = [{ backgroundColor: [] }];
  pieChartOptions: any;

  constructor(private router: Router,
              private appService: AppService)
  {
    this.getGame();
    this.getUser();
  }

  ngOnInit(): void {
  }

  getGame() {
    this.appService.getGame().subscribe((data) => {
      this.Game = data;
      this.prepareChartData();
    });
  }

  getUser(){

    if (this.appService.getLoggedInUser().uname == null)
    {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.uname = JSON.stringify(this.user.uname);
  }

  deleteGame(id: string, index: number) {
    if (confirm('Biztosan törölni szeretné a játékot?')) {
      this.appService.deleteGame(id).subscribe(() => {
        this.Game.splice(index, 1);
        this.prepareChartData();
      });
    }
  }

  incrementAmount(game: any) {
    game.amount += 1;
    this.updateGame(game);
  }

  decrementAmount(game: any) {
    if (game.amount > 0) {
      game.amount -= 1;
      this.updateGame(game);
    }
  }

  updateGame(game: any) {
    this.appService.updateGame(game._id, game).subscribe(response => {
    this.prepareChartData();
    });
  }

  prepareChartData() {
    const chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    this.Game.forEach(game => {
      chartData.push({
        label: game.name,
        data: game.amount
      });
    });

    chartData.forEach(item => {
      this.pieChartLabels.push(item.label);
      this.pieChartData.push(item.data);
      this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
    });

    this.pieChartOptions = {
      title: {
        display: true,
        text: 'Játékok mennyisége név szerint csoportosítva',
        fontSize: 20,
        fontColor: 'black'
      },
      legend: {
        labels: {
          fontColor: 'black',
        }
      },
      tooltips: {
        callbacks: {
          labelTextColor: function() {
            return '#FFFFFF';
          }
        }
      }
    };
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  logout(){
    this.user = new User();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
  back(){
    this.router.navigate(['/add']);
  }
}
