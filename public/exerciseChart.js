async function createChart(){
    try{
        const response =await fetch('/tracker/chartData')
        if(!contentType ||!contentType.includes('application/json')){
        console.error(await response.text());
        return;
        }
        const data = await response.json();
        const ctx =document.getElementById('exerciseChart').getContext('2d')
        new Chart(ctx,{
            type: "bar",
            data: {
                labels: data.labels,
                datasets:[{
                    label: "Number of Times Performed",
                    data: data.sets,
                    backgroundColor: 'rgb(30, 139, 0)',
                    borderColor: 'rgb(255, 255, 255)',
                    borderWidth: 1
                }]
            },
            options: {
                scales:{
                    y:{beginAtZero: true, precision: 0,ticks: {color: "white"}},
                    x:{ticks: { color: "white"}}
                },
                plugins:{
                    legend:{display: false},
                    title:{display: true,text:"Number of sets done per exercise", font: { size: 20 },color:"white" }
                }
            }
        });
    }catch(err){
        console.error(err)
    }
}
window.addEventListener('DOMContentLoaded', createChart)
