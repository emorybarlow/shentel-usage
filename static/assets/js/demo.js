type = ['','info','success','warning','danger'];


demo = {

    initChartist: async function(){

        let labels = [];
        let data = [];
        let maxUsed = 400;
        const account = $('#account').val();
        const response = await fetch(`/shentel/usage/${account}`);
        const json = await response.json();
        json.forEach((period) => {
            labels.push(period['@period']);
            const used = parseFloat(period['totalOctetsTxt'].split(' ')[0]);
            if (used > maxUsed) {
                maxUsed = used;
            }
            data.push(used);
        });
        const quota = parseFloat(json.pop()['quotaTxt'].split(' ')[0]);
        console.log(data);

        var dataUsage = {
          labels: labels,
          series: [
             data,
          ]
        };

        var optionsUsage = {
          lineSmooth: false,
          low: 0,
          high: maxUsed+50,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveUsage = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return `${value[0]}${value[1]}${value[2]}`;
              }
            }
          }]
        ];

        Chartist.Bar('#chartUsage', dataUsage, optionsUsage, responsiveUsage).on('draw', function(data) {
            if(data.type === 'bar') {
                let stroke = '#68B3C8';
                if(parseFloat(data.value.y) > quota) {
                    stroke = '#EB5E28';
                }
                else if(parseFloat(data.value.y) / quota > 0.8) {
                    stroke = '#F3BB45';
                }
                data.element.attr({
                    style: `stroke-width: 30px;stroke: ${stroke}`
                });
            }
        });
    }

}
