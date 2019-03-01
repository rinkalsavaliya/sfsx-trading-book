const d3 = require('d3');

export class DashboardHelper {
  public static validateScalling(d: any, max: number) {
    const s  = (d * 100) / max;
    return s;
  }
  initiazeChart(graphData, chartLabels) {
    setTimeout(() => {
      const buyMax =  Math.max(...graphData[0].data);
      const sellMax =  Math.max(...graphData[1].data);
      const chart = d3.selectAll('.chart-contanier').append('div').attr('class', 'barchart').style('display', 'flex').style('flex-wrap', 'wrap')
      .style('justify-content', 'space-between');
      let w = document.getElementById('charts').clientWidth;
       w = w - 60;
      const svg = chart.append('div').attr('class', 'barDiv').append('svg')
        .style('overflow', 'visible').attr('width', w + 'px').attr('height', '200px');
      const bartooltip = d3.select('.barDiv').append('div')
        .attr('class', 'tooltip').style('position', 'absolute').style('background', '#e7e7e7')
        .style('display', 'flex').style('flex-wrap', 'wrap').style('box-shadow', '0 0 5px #999999')
        .style('color', '#333').style('display', 'none').style('left', '170px').style('top', '320px')
        .style('padding', '5px').style('text-align', 'center').style('width', '200px').style('height', '50px').style('z-index', '10');
      bartooltip.append('div').attr('class', 'type');
      bartooltip.append('div').attr('class', 'game');

      const buyBarToolTip = svg.selectAll('.buy-bar,.buy-bar-data')
        .data(graphData[0].data)
        .enter().append('rect').attr('class', 'buy-bar  buy-bar-data').style('fill', '#e7e7e7')
        .attr('width', '20px').attr('height', '200px')
        .attr('x', (d: number, i: number) => { return i * (w / graphData[0].data.length) + 25; }).attr('y', 20);

      svg.selectAll('.buy-bardata')
        .data(graphData[0].data)
        .enter().append('rect').style('fill', '#ce2127').attr('width', '20px')
        .attr('x', (d: number, i: number) => { return i * (w / graphData[0].data.length) + 25; })
        .attr('y', 220).attr('height', 0).transition().ease(d3.easeLinear)
        .duration(400)
        .delay((d: number, i: number) => {
          return i * 50;
        })
        .attr('height', (d: number, i: number) => {
          return DashboardHelper.validateScalling(d, buyMax);
        }).attr('y', (d: number, i: number) => {
          return 220  - DashboardHelper.validateScalling(d, buyMax);
        });

      svg.selectAll('.buy-bottom-text')
        .data(chartLabels).enter().append('text')
        .attr('class', 'buy-custom').text((d: string) => { return d; })
        .attr('x', (d: string, i: number) => { return i * (w / graphData[0].data.length) + 25; })
        .attr('y', (d: string, i: number) => { return (220 + 20); }).style('fill', 'black')
        .style('font-size', '13px');

      const sellBarTooltip = svg.selectAll('.sell-bar')
        .data(graphData[1].data).enter().append('rect').attr('class', 'sell-bar')
        .style('fill', '#e7e7e7').attr('width', '20px').attr('height', '200px')
        .attr('x', (d: number, i: number) => { return i * (w / graphData[1].data.length) + 55; }).attr('y', 20);

      svg.selectAll('.sell-bar-data').data(graphData[1].data)
        .enter().append('rect').style('fill', '#2185d0').attr('class', 'sell-bar-data').attr('width', '20px')
        .attr('x', (d: number, i: number) => { return i * (w / graphData[1].data.length) + 55; })
        .attr('y', 220).attr('height', 0).transition()
        .ease(d3.easeLinear).duration(400)
        .delay((d: number, i: number) => {
          return i * 50;
        })
        .attr('height', (d: number) => {
          return DashboardHelper.validateScalling(d, sellMax);
        }).attr('y', (d: number) => {
          return 220 - DashboardHelper.validateScalling(d, sellMax);
        });

      buyBarToolTip.on('mouseover', (d: { data: number }, i: string) => {
        bartooltip.select('.type').html(chartLabels[i]);
        bartooltip.select('.game').html(`Buy : ${d}`);
        // bartooltip.select('.percent').html(d);
        bartooltip.style('display', 'block');
        bartooltip.style('opacity', 1);
      });

      buyBarToolTip.on('mouseout', () => {
        bartooltip.style('display', 'none');
      });

      buyBarToolTip.on('mousemove', () => {
        bartooltip.style('top', (d3.event.layerY + 20) + 'px').style('left', (d3.event.layerX - 1) + 'px');
      });

      sellBarTooltip.on('mouseover', (d: { data: number }, i: string) => {
        bartooltip.select('.type').html(chartLabels[i]);
        bartooltip.select('.game').html(`Sell :${d}`);

        bartooltip.style('display', 'block');
        bartooltip.style('opacity', 1);
      });

      svg.selectAll('.buy-custom').on('click', (data: string) => {
        console.log(data, 'buy click');
      });

      svg.selectAll('.sell-bar-data').on('click', (data: string) => {
        console.log(data, 'sell click');
      });

      sellBarTooltip.on('mouseout', () => {
        bartooltip.style('display', 'none');
      });

      sellBarTooltip.on('mousemove', () => {
        bartooltip.style('top', (d3.event.layerY + 20) + 'px').style('left', (d3.event.layerX - 1) + 'px');
      });
    }, 500);
  }
}
