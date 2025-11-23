import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';

interface EMIScenario {
  prepaymentAmount: number;
  newEMI: number;
  newTenure: number;
  totalInterest: number;
  totalAmount: number;
  savings: number;
}

interface TenureScenario {
  prepaymentAmount: number;
  emi: number;
  newTenure: number;
  monthsReduced: number;
  totalInterest: number;
  totalAmount: number;
  savings: number;
}

interface AmortizationRow {
  month: number;
  startingBalance: number;
  interestPaid: number;
  principalPaid: number;
  outstandingRemaining: number;
  prepayment: number;
  newOutstandingRemaining: number;
}

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    ChartModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  // Form inputs
  loanAmount: number = 1000000;
  interestRate: number = 8.5;
  tenureYears: number = 20;
  currentEMI: number = 0;

  // Summary fields for readonly display
  noPrepayment = {
    totalAmountPaid: 0,
    principalPaid: 0,
    interestPaid: 0,
    amountSaved: 0,
    loanPaidInYears: 0
  };

  reduceTerm = {
    totalAmountPaid: 0,
    principalPaid: 0,
    interestPaid: 0,
    amountSaved: 0,
    loanPaidInYears: 0
  };

  reduceEMI = {
    totalAmountPaid: 0,
    principalPaid: 0,
    interestPaid: 0,
    amountSaved: 0,
    loanPaidInYears: 0
  };

  // Chart data
  chartData: any;
  chartOptions: any;

  // Scenarios data
  reduceEMIScenarios: EMIScenario[] = [];
  reduceTenureScenarios: TenureScenario[] = [];
  amortizationSchedule: AmortizationRow[] = [];
  reduceEMIAmortizationSchedule: AmortizationRow[] = [];

  ngOnInit() {
    this.calculateEMI();
  }

  calculateEMI() {
    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / 12 / 100;
    const tenureMonths = this.tenureYears * 12;

    // Calculate EMI using formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    this.currentEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    this.generateScenarios();
  }

  generateScenarios() {
    this.reduceEMIScenarios = [];
    this.reduceTenureScenarios = [];

    const prepaymentAmounts = [50000, 100000, 150000, 200000, 250000];
    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / 12 / 100;
    const tenureMonths = this.tenureYears * 12;

    // Calculate original total payment (No Prepayment)
    const originalTotalPayment = this.currentEMI * tenureMonths;
    const originalTotalInterest = originalTotalPayment - principal;

    // Set No Prepayment summary
    this.noPrepayment = {
      totalAmountPaid: originalTotalPayment,
      principalPaid: principal,
      interestPaid: originalTotalInterest,
      amountSaved: 0,
      loanPaidInYears: this.tenureYears
    };

    // Use first prepayment amount (50000) for Reduce Term and Reduce EMI summaries
    const samplePrepayment = 50000;
    const newPrincipalSample = principal - samplePrepayment;

    // Calculate Reduce Term summary
    const newTenureMonthsTerm = Math.log(this.currentEMI / (this.currentEMI - newPrincipalSample * monthlyRate)) /
      Math.log(1 + monthlyRate);
    const totalPaymentReduceTerm = this.currentEMI * newTenureMonthsTerm + samplePrepayment;
    const totalInterestReduceTerm = totalPaymentReduceTerm - principal;

    this.reduceTerm = {
      totalAmountPaid: totalPaymentReduceTerm,
      principalPaid: principal,
      interestPaid: totalInterestReduceTerm,
      amountSaved: originalTotalPayment - totalPaymentReduceTerm,
      loanPaidInYears: newTenureMonthsTerm / 12
    };

    // Calculate Reduce EMI summary
    const newEMISample = (newPrincipalSample * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPaymentReduceEMI = newEMISample * tenureMonths + samplePrepayment;
    const totalInterestReduceEMI = totalPaymentReduceEMI - principal;

    this.reduceEMI = {
      totalAmountPaid: totalPaymentReduceEMI,
      principalPaid: principal,
      interestPaid: totalInterestReduceEMI,
      amountSaved: originalTotalPayment - totalPaymentReduceEMI,
      loanPaidInYears: this.tenureYears
    };

    prepaymentAmounts.forEach(prepayment => {
      const newPrincipal = principal - prepayment;

      // Scenario 1: Reduce EMI (keep tenure same)
      const newEMI = (newPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      const totalPaymentReduceEMI = newEMI * tenureMonths + prepayment;
      const totalInterestReduceEMI = totalPaymentReduceEMI - principal;
      const savingsReduceEMI = originalTotalPayment - totalPaymentReduceEMI;

      this.reduceEMIScenarios.push({
        prepaymentAmount: prepayment,
        newEMI: newEMI,
        newTenure: this.tenureYears,
        totalInterest: totalInterestReduceEMI,
        totalAmount: totalPaymentReduceEMI,
        savings: savingsReduceEMI
      });

      // Scenario 2: Reduce Tenure (keep EMI same)
      const newTenureMonths = Math.log(this.currentEMI / (this.currentEMI - newPrincipal * monthlyRate)) /
        Math.log(1 + monthlyRate);
      const newTenureYears = newTenureMonths / 12;
      const monthsReduced = tenureMonths - newTenureMonths;
      const totalPaymentReduceTenure = this.currentEMI * newTenureMonths + prepayment;
      const totalInterestReduceTenure = totalPaymentReduceTenure - principal;
      const savingsReduceTenure = originalTotalPayment - totalPaymentReduceTenure;

      this.reduceTenureScenarios.push({
        prepaymentAmount: prepayment,
        emi: this.currentEMI,
        newTenure: newTenureYears,
        monthsReduced: monthsReduced,
        totalInterest: totalInterestReduceTenure,
        totalAmount: totalPaymentReduceTenure,
        savings: savingsReduceTenure
      });
    });

    // Generate amortization schedule
    this.generateAmortizationSchedule();
    this.generateReduceEMIAmortizationSchedule();

    // Initialize chart data
    this.initializeChartData();
  }

  generateAmortizationSchedule() {
    this.amortizationSchedule = [];

    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / 12 / 100;
    const tenureMonths = this.tenureYears * 12;
    const prepaymentMonth = 12; // Prepayment happens at month 12
    const prepaymentAmount = 50000; // Default prepayment amount

    let balance = principal;

    for (let month = 1; month <= tenureMonths; month++) {
      const startingBalance = balance;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = this.currentEMI - interestForMonth;

      // Calculate balance after regular EMI payment
      balance = balance - principalForMonth;

      let prepayment = 0;
      let newBalance = balance;

      // Apply prepayment at specified month
      if (month === prepaymentMonth) {
        prepayment = prepaymentAmount;
        newBalance = balance - prepayment;
        balance = newBalance; // Update balance for next month
      }

      this.amortizationSchedule.push({
        month: month,
        startingBalance: startingBalance,
        interestPaid: interestForMonth,
        principalPaid: principalForMonth,
        outstandingRemaining: balance,
        prepayment: prepayment,
        newOutstandingRemaining: newBalance
      });

      // Stop if loan is paid off
      if (balance <= 0) {
        break;
      }
    }
  }

  generateReduceEMIAmortizationSchedule() {
    this.reduceEMIAmortizationSchedule = [];

    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / 12 / 100;
    const tenureMonths = this.tenureYears * 12;
    const prepaymentMonth = 12; // Prepayment happens at month 12
    const prepaymentAmount = 50000; // Default prepayment amount

    let balance = principal;
    let currentEMI = this.currentEMI;

    for (let month = 1; month <= tenureMonths; month++) {
      const startingBalance = balance;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = currentEMI - interestForMonth;

      // Calculate balance after regular EMI payment
      balance = balance - principalForMonth;

      let prepayment = 0;
      let newBalance = balance;

      // Apply prepayment at specified month and recalculate EMI
      if (month === prepaymentMonth) {
        prepayment = prepaymentAmount;
        newBalance = balance - prepayment;
        balance = newBalance;

        // Recalculate reduced EMI for remaining months
        const remainingMonths = tenureMonths - month;
        if (remainingMonths > 0) {
          // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
          const factor = Math.pow(1 + monthlyRate, remainingMonths);
          currentEMI = (balance * monthlyRate * factor) / (factor - 1);
        }
      }

      this.reduceEMIAmortizationSchedule.push({
        month: month,
        startingBalance: startingBalance,
        interestPaid: interestForMonth,
        principalPaid: principalForMonth,
        outstandingRemaining: balance,
        prepayment: prepayment,
        newOutstandingRemaining: newBalance
      });

      // Stop if loan is paid off
      if (balance <= 0) {
        break;
      }
    }
  }


  initializeChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['No Prepayment', 'Reduce Term (₹50k)', 'Reduce EMI (₹50k)'],
      datasets: [
        {
          label: 'Principal',
          data: [
            this.noPrepayment.principalPaid,
            this.reduceTerm.principalPaid,
            this.reduceEMI.principalPaid
          ],
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 1
        },
        {
          label: 'Interest',
          data: [
            this.noPrepayment.interestPaid,
            this.reduceTerm.interestPaid,
            this.reduceEMI.interestPaid
          ],
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          borderColor: documentStyle.getPropertyValue('--red-500'),
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        title: {
          display: true,
          text: 'Loan Comparison - Principal vs Interest',
          color: textColor,
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  onCalculate() {
    this.calculateEMI();
  }
}
