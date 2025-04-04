import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            CommonModule,
            FormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoicee_app';
  invoice = {
    customerName: '',
    address: '',
    date: new Date().toISOString().substring(0, 10),
    items: [{ description: '', quantity: 1, price: 0 }],
  };

  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;

  isPaid: boolean = false;

  addItem() {
    this.invoice.items.push({ description: '', quantity: 1, price: 0 });
  }

  removeItem(index: number) {
    this.invoice.items.splice(index, 1);
  }

  get total() {
    return this.invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  generatePDF() {
    const element = this.invoiceContent.nativeElement;
    import('html2pdf.js').then(html2pdf => {
      html2pdf.default().from(element).save('invoice.pdf');
    });
  }

  // Example: Toggle the paid status
  markAsPaid() {
    this.isPaid = true;
  }

  togglePaid() {
    this.isPaid = !this.isPaid;
  }
}
