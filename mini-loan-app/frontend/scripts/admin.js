// admin.js

const approveLoan = async (loanId) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
        const response = await fetch(`/api/loans/approve/${loanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Loan approved successfully!');
            location.reload(); // Reload the page to reflect changes
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error approving loan:', error);
        alert('An error occurred while approving the loan.');
    }
};

// Example: Call this function when an admin clicks the approve button
// document.getElementById('approveButton').addEventListener('click', () => approveLoan(loanId));
