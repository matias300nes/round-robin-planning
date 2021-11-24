queue2 = [
    {
        id: 1,
        process:"A",
        color:"purple",
        arrival_time:0,
        process_time:3,
        temp:0,
        start_time:null,
        end_time:null
    },
    {
        id: 2,
        process:"B",
        color:"red",
        arrival_time:1,
        process_time:5,
        temp:0,
        start_time:null,
        end_time:null
    },
    {
        id: 3,
        process:"C",
        color:"yellow",
        arrival_time:3,
        process_time:2,
        temp:0,
        start_time:null,
        end_time:null
    },
    {
        id: 4,
        process:"D",
        color:"green",
        arrival_time:9,
        process_time:5,
        temp:0,
        start_time:null,
        end_time:null
    },
    {
        id: 5,
        process:"E",
        color:"pink",
        arrival_time:12,
        process_time:5,
        temp:0,
        start_time:null,
        end_time:null
    }
]
queue = []
quantum = 1

//round robin planning function
function planRoundRobin(quantum) {
    planning = []
    notFinished = queue
    notFinished = queue.slice()
    start_time = 0
    current_time = start_time
    arrived = []

    //sort processes by arrival time
    notFinished.sort((a, b) => {
        return a.arrival_time - b.arrival_time
    })

    //using temp for not lose time value
    notFinished.map(p => {
        p.temp = p.process_time
        p.start_time = null
        p.end_time = null
    })

    //while there are processes not finished
    i=-1
    while (notFinished.length > 0) {
        
        arrived = notFinished.filter(p => p.arrival_time <= current_time)

        if (arrived.length == 0){
            //if there are no arrived processes, avance current time
            planning.push({
                name:"",
                color:"white"
            })
            current_time++
        }else{
            //sort processes by arrival time
            if (i < arrived.length - 1) {
                i++
            }else{
                i=0
            }

            timeToProcess = arrived[i].temp
            processIndex = notFinished.indexOf(arrived[i])

            //process the first process arrived
            if (notFinished[processIndex].start_time == null) {
                notFinished[processIndex].start_time = current_time
            }
            if (arrived[i].temp < quantum) {
                for (let j = 0; j < timeToProcess; j++) {
                    notFinished[processIndex].temp--
                    current_time++
                    planning.push({
                        name:arrived[i].process,
                        color:arrived[i].color
                    })
                }
            }else{
                for (let j = 0; j < quantum; j++) {
                    notFinished[processIndex].temp--
                    current_time++
                    planning.push({
                        name:arrived[i].process,
                        color:arrived[i].color
                    })
                }
            }

            if(arrived[i].temp <= 0){
                i--
                notFinished[processIndex].end_time = current_time
                notFinished.splice(processIndex, 1)
            }
        }
    }
    return planning
}

function drawPlanning(planning) {
    table = document.querySelector(".planning-table")
    table.innerHTML = ""

    //add process to table
    html = ""
    queue.map(p => {
        html += `<tr>
                    <td>${p.process}</td>
                    <td>${p.arrival_time}</td>
                    <td>${p.process_time}</td>
                    <td>${p.start_time}</td>
                    <td>${p.end_time}</td>
                    <td>${p.end_time - p.arrival_time}</td>
                    <td>${(p.end_time - p.arrival_time)/p.process_time}</td>
                </tr>`
    })
    document.getElementById("table-body").innerHTML = html

    //adding individual processes to table
    queue.map(p => {
        row = document.createElement("tr")
        row.innerHTML = ""
        for (let i = 0; i < planning.length; i++) {
            if (planning[i].name == p.process) {
                //write process name
                cell = document.createElement("td")
                cell.innerHTML = planning[i].name
                cell.style.backgroundColor = planning[i].color
                row.appendChild(cell)
            }else if (p.arrival_time <= i && p.end_time > i) {
                console.log(i)
                //write black cell
                cell = document.createElement("td")
                cell.style.backgroundColor = "black"
                row.appendChild(cell)
            }else{
                //write white cell
                cell = document.createElement("td")
                cell.style.backgroundColor = "white"
                row.appendChild(cell)
            }
        }
        table.appendChild(row)
    })

    //adding a row with numbers
    row = document.createElement("tr")
    row.innerHTML = ""
    for (let i = 0; i < planning.length; i++) {
        cell = document.createElement("td")
        cell.setAttribute("style", "color:black;")
        cell.innerHTML = i
        row.appendChild(cell)
    }
    table.appendChild(row)
    
    //adding planning to table
    result = document.createElement("tr")
    planning.map(p => {
        result.innerHTML += `<td style='background:${p.color};'>${p.name}</td>`
    })
    table.appendChild(result)
}

window.onload = function() {
    form = document.getElementById("form")
    quantum_selector = document.getElementById("quantum")

    //add event listener to quantum selector
    quantum_selector.addEventListener("change", () => {
        quantum = parseInt(quantum_selector.value)
        drawPlanning(planRoundRobin(quantum))
    })

    //add event listener to form
    form.addEventListener("submit", function(e) {
        e.preventDefault()
        process = document.getElementById("process-input").value
        color = document.getElementById("color-input").value
        arrival_time = parseInt(document.getElementById("arrival-time-input").value)
        process_time = parseInt(document.getElementById("process-time-input").value)

        queue.push(obj = {
            id:queue.length, 
            process:process,
            color:color,
            arrival_time:arrival_time,
            process_time:process_time,
            temp:0,
            start_time:null,
            end_time:null
        })

        drawPlanning(planRoundRobin(quantum))

        //clear form
        form.reset()   
    })
}