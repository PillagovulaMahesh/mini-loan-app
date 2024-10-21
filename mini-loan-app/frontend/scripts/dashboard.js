// dashboard.js

const fetchLoans = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/loans', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const loans = await response.json();
            displayLoans(loans);
        } else {
            console.error('Failed to fetch loans');
            alert('Error fetching loans. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching loans:', error);
    }
};

const displayLoans = (loans) => {
    const loanList = document.getElementById('loanList');
    loanList.innerHTML = ''; // Clear existing loans

    loans.forEach(loan => {
        const loanItem = document.createElement('div');
        loanItem.classList.add('loan-item');
        loanItem.innerHTML = `
            <p>Loan ID: ${loan.id}</p>
            <p>Amount: $${loan.amount}</p>
            <p>Term: ${loan.term} weeks</p>
            <p>Status: ${loan.status}</p>
            <button onclick="makeRepayment(${loan.id})">Make Repayment</button>
        `;
        loanList.appendChild(loanItem);
    });
};

const makeRepayment = async (loanId) => {
    const repaymentAmount = prompt('Enter repayment amount:');
    if (!repaymentAmount) return; // Cancel if no amount is entered

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/repayments/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ loanId, amount: parseFloat(repaymentAmount) })
        });

        if (response.ok) {
            alert('Repayment made successfully!');
            fetchLoans(); // Refresh the loan list
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error making repayment:', error);
        alert('An error occurred while making the repayment.');
    }
};

// Fetch loans on page load
document.addEventListener('DOMContentLoaded', fetchLoans);
