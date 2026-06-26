let expenses = [];
let budget = 0;

// Add Expense
function addExpense() {
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value.trim();

    if (isNaN(amount) || amount <= 0 || category === "") {
        alert("Please enter a valid amount and category.");
        return;
    }

    expenses.push({
        amount,
        category
    });

    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    updateDisplay();
}

// Set Budget
function setBudget() {
    budget = parseFloat(document.getElementById("budget").value);

    if (isNaN(budget) || budget < 0) {
        alert("Enter a valid budget.");
        return;
    }

    updateDisplay();
}

// Update Everything
function updateDisplay() {

    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    let total = 0;

    const categoryTotals = {};

    expenses.forEach(expense => {

        total += expense.amount;

        const li = document.createElement("li");
        li.textContent = `${expense.category} - $${expense.amount.toFixed(2)}`;
        list.appendChild(li);

        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }

    });

    document.getElementById("total").textContent = total.toFixed(2);

    document.getElementById("remaining").textContent =
        (budget - total).toFixed(2);

    const categories = document.getElementById("categories");
    categories.innerHTML = "";

    for (const category in categoryTotals) {

        const li = document.createElement("li");

        li.textContent =
            `${category}: $${categoryTotals[category].toFixed(2)}`;

        categories.appendChild(li);

    }

    drawChart(categoryTotals);
}

// Export CSV
function exportCSV() {

    let csv = "Category,Amount\n";

    expenses.forEach(expense => {
        csv += `${expense.category},${expense.amount}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "expenses.csv";

    link.click();

}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

let chart;

function drawChart(categoryTotals){

    const ctx = document.getElementById("expenseChart");

    const labels = Object.keys(categoryTotals);

    const data = Object.values(categoryTotals);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:'pie',
        data:{
            labels:labels,
            datasets:[{
                data:data
            }]
        }
    });

}