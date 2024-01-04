
    function display_Table(events) {



        console.log(events);

        if (events && events.length > 0 && Array.isArray(events)) {
                console.log("hiii");
        }
        else{
            console.log("hiii2");
            document.getElementById('dashboard-event-details').innerHTML = `
        <h2>No events registered yet.</h2>
    `;
        }
    console.log(events);
   console.log("abc");
    const tableBody = document.getElementById('event-table-body');
        console.log(tableBody)
        tableBody.innerHTML='';
       // document.getElementById('event-table-body').innerHTML = ``;



    if (events && Array.isArray(events) && events.length>0 ) {
console.log(events);
        events.forEach(event => {


            const row = tableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = event.eventName;
            cell2.textContent = event.eventDetails;
            cell3.textContent = event.eventDate;

            // Add a delete button with an onclick event
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.onclick = function () {
                
                deleteEvent(event.eventName, event.loggedInUser);
                window.location.reload(true);
            };

            const cell4 = row.insertCell(3);
            cell4.appendChild(deleteButton);

        });

      
    } 
    else
     {
     
        document.getElementById('dashboard-event-details').innerHTML = `
            <h2>No events registered yet.</h2>
        `;
    }
}
