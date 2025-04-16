import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            CommonModule,
            FormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatCardModule,
            MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoicee_app';
  invoice = {
    customerName: '',
    address: '',
    date: new Date().toISOString().substring(0, 10),
    items: [{ description: '', quantity: 1, price: '' }], // Set price as an empty string
  };

  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;

  isPaid: boolean = false;

  addItem() {
    this.invoice.items.push({ description: '', quantity: 1, price: '' }); // Add new items with an empty price
  }

  removeItem(index: number) {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      this.invoice.items.splice(index, 1);
    }
  }

  get total() {
    return this.invoice.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0; // Safely parse the price as a number
      return sum + item.quantity * price;
    }, 0);
  }

  generatePDF() {
    const element = this.invoiceContent.nativeElement;

    // Create a deep clone of the invoice content
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Add the PDF-specific class to the cloned element
    clonedElement.classList.add('pdf-content');

    // Create a wrapper for positioning
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.paddingBottom = '40px'; // Add space for the date-time stamp
    wrapper.appendChild(clonedElement);

    // Create a date-time stamp element
    const dateTimeStamp = document.createElement('div');
    dateTimeStamp.style.position = 'absolute';
    dateTimeStamp.style.bottom = '10px';
    dateTimeStamp.style.right = '10px';
    dateTimeStamp.style.fontSize = '12px';
    dateTimeStamp.style.color = '#555';
    dateTimeStamp.textContent = `Printed on: ${new Date().toLocaleString()}`;

    // Append the date-time stamp to the wrapper
    wrapper.appendChild(dateTimeStamp);

    // Append the wrapper to the body (hidden)
    document.body.appendChild(wrapper);

    import('html2pdf.js').then(html2pdf => {
      html2pdf.default()
        .from(wrapper)
        .set({
          margin: 0,
          filename: 'invoice.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save()
        .finally(() => {
          // Remove the wrapper after generating the PDF
          document.body.removeChild(wrapper);
        });
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
