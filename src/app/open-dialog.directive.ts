import {Directive, HostListener} from '@angular/core';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';

@Directive({
  selector: '[appOpenDialog]',
})
export class OpenDialogDirective {

  constructor(private dialog: MatDialog) {}
  @HostListener('click', ['$event']) onClick($event: Event): void{
   this.openDialog();
  }

  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginDialogComponent, dialogConfig);
  }

}
