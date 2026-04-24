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

import { TimeSeriesDatum } from '../../../models/chart-datum.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @Input() data: TimeSeriesDatum[] = [];
  @Input() height = 300;
  @Input() prefix = '$';

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
    const hostWidth = svgElement.parentElement?.clientWidth ?? 640;
    const width = Math.max(hostWidth, 320);
    const height = this.height;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    if (!this.data.length) {
      return;
    }

    const margin = { top: 24, right: 20, bottom: 36, left: 54 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scalePoint<string>()
      .domain(this.data.map((datum) => datum.label))
      .range([0, innerWidth])
      .padding(0.5);

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
          .tickFormat((value) => `${this.prefix}${d3.format('~s')(Number(value))}`),
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

    const area = d3
      .area<TimeSeriesDatum>()
      .x((datum) => x(datum.label) ?? 0)
      .y0(innerHeight)
      .y1((datum) => y(datum.value))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<TimeSeriesDatum>()
      .x((datum) => x(datum.label) ?? 0)
      .y((datum) => y(datum.value))
      .curve(d3.curveMonotoneX);

    root
      .append('path')
      .datum(this.data)
      .attr('fill', 'rgba(31, 111, 235, 0.14)')
      .attr('d', area);

    root
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#1f6feb')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    root
      .selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (datum) => x(datum.label) ?? 0)
      .attr('cy', (datum) => y(datum.value))
      .attr('r', 4.5)
      .attr('fill', '#1f6feb')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
  }
}
