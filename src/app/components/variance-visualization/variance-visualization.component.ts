import { Component, OnInit } from '@angular/core';
import { StationService } from "../../service/station.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-variance-visualization',
  templateUrl: './variance-visualization.component.html',
  styleUrls: ['./variance-visualization.component.scss']
})
export class VarianceVisualizationComponent implements OnInit {

  private svg: any;
  private graph: any;
  private margin = 50;
  private heightMargin = 10;
  private height = 20;
  private barWidth = 6;

  constructor(private service: StationService) {}

  ngOnInit(): void {
    this.graph = document.getElementById("graph");

    this.createSvg();

    this.service.station$.subscribe(s => this.display(this.service.variance(s)));
    this.service.stationUpdate$.subscribe(u => this.display(this.service.variance(u.after)));

    window.onresize = () => this.resize(this.service.variance(this.service.station));
  }

  display(variance: number) {
    const b = d3.scaleLinear()
      .domain([0, 100])
      .range([0, this.width / 2]);

    this.svg.selectAll("bars")
      .data([variance])
      .enter()
      .select("#marker")
        .transition()
        .duration(800)
        .attr("x", (d: any) => (this.width / 2) + b(Math.abs(d)) * Math.sign(d));

    // Update and fill the bars
    this.svg.selectAll("bars")
      .data([variance])
      .enter()
      .select("#bar")
        .transition()
        .duration(800)
        .attr("x", (d: any) => (this.width / 2) - (b(d) < 0 ? Math.abs(b(d)) : 0))
        .attr("width", (d: any) => b(Math.abs(d)))
        .attr("fill", this.calcColor);
  }

  private resize(variance: number) {
    // Create the X-axis band scale
    const x = d3.scaleLinear()
      .domain([-100.0, 100.0])
      .range([0, this.width]);

    const b = d3.scaleLinear()
      .domain([0, 100])
      .range([0, this.width / 2]);

    // Draw the X-axis on the DOM
    this.svg.select("#axis-x")
      .call(d3.axisBottom(x))

    this.svg.selectAll("bars")
      .data([variance])
      .enter()
      .select("#marker")
      .attr("x", (d: any) => (this.width / 2) + b(Math.abs(d)) * Math.sign(d));

    // Update and fill the bars
    this.svg.selectAll("bars")
      .data([variance])
      .enter()
      .select("#bar")
      .attr("x", (d: any) => (this.width / 2) - (b(d) < 0 ? Math.abs(b(d)) : 0))
      .attr("width", (d: any) => b(Math.abs(d)))
      .attr("fill", this.calcColor);
  }

  private createSvg(): void {
    this.svg = d3.select("#graph")
      .append("svg")
      //.attr("width", this.width + (this.margin * 2))
      .attr("width", "100%")
      .attr("height", this.height + (this.heightMargin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.heightMargin + ")");

    // Create the X-axis band scale
    const x = d3.scaleLinear()
      .domain([-100.0, 100.0])
      .range([0, this.width]);

    const b = d3.scaleLinear()
      .domain([0, 100])
      .range([0, this.width / 2]);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("id", "axis-x")
      .attr("transform", "translate(0," + this.barWidth / 2 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    this.svg.selectAll("bars")
      .data([0])
      .enter()
      .append("rect")
        .attr("id", "marker")
        .attr("x", (d: any) => (this.width / 2) + b(d) * Math.sign(d))
        .attr("width", 1)
        .attr("height", 20)
        .attr("transform", "translate(-1,-10)")
        .attr("fill", "red");

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data([0])
      .enter()
      .append("rect")
        .attr("id", "bar")
        .attr("x", (d: any) => (this.width / 2) - (b(d) < 0 ? Math.abs(b(d)) : 0))
        .attr("width", (d: any) => b(Math.abs(d)))
        .attr("height", this.barWidth)
        .attr("rx", "4")
        .attr("fill", this.calcColor);
  }

  calcColor(d: any) {
    if (d <= -10) {
      return "rgba(200, 100, 100, 1)";
    } else if (d > 5) {
      return "rgba(100, 200, 100, 1)";
    } else {
      return "rgba(100, 100, 100, 1)";
    }
  }

  get variance() {
    return this.service.variance(this.service.station);
  }

  get value() {
    return this.service.station?.value || 0;
  }

  get target() {
    return this.service.station?.target || 0;
  }

  get width() {
    const w = this.graph.clientWidth - (this.margin * 2);

    return w > 0 ? w : 0;
  }

}
