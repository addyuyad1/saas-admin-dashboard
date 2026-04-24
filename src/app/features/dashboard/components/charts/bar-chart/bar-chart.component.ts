import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

import { ChartDatum } from '../../../models/chart-datum.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @Input() data: ChartDatum[] = [];
  @Input() height = 300;

  @ViewChild('svgHost', { static: true })
  private readonly svgHostRef!: ElementRef<SVGSVGElement>;

  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.viewReady) {
      this.renderChart();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.renderChart();
  }

  private renderChart(): void {
    const svgElement = this.svgHostRef.nativeElement;
    const hostWidth = svgElement.parentElement?.clientWidth ?? 520;
    const width = Math.max(hostWidth, 320);
    const height = this.height;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    if (!this.data.length) {
      return;
    }

    const margin = { top: 20, right: 16, bottom: 40, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand<string>()
      .domain(this.data.map((datum) => datum.label))
      .range([0, innerWidth])
      .padding(0.32);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (datum) => datum.value)! * 1.15])
      .nice()
      .range([innerHeight, 0]);

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const root = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    root
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat((value) => d3.format('~s')(Number(value))),
      )
      .call((group) =>
        group.selectAll('text').attr('fill', '#5d6980').attr('font-size', 12),
      )
      .call((group) => group.select('.domain').remove())
      .call((group) =>
        group
          .selectAll('line')
          .attr('stroke', '#d8e0ee')
          .attr('stroke-dasharray', '4 4'),
      );

    root
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .call((group) =>
        group.selectAll('text').attr('fill', '#5d6980').attr('font-size', 12),
      )
      .call((group) =>
        group
          .selectAll('line, path')
          .attr('stroke', '#d8e0ee')
          .attr('stroke-width', 1),
      );

    root
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (datum) => x(datum.label) ?? 0)
      .attr('y', (datum) => y(datum.value))
      .attr('width', x.bandwidth())
      .attr('height', (datum) => innerHeight - y(datum.value))
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', '#3f8cff');
  }
}
