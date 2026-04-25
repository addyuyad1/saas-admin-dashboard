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

import { ChartDatum } from '../chart.models';

@Component({
  selector: 'app-chart-pie',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPieChartComponent implements AfterViewInit, OnChanges {
  @Input() data: ChartDatum[] = [];
  @Input() height = 300;
  @Input() centerLabel = 'Total';
  @Input() ariaLabel = 'Pie chart';

  @ViewChild('svgHost', { static: true })
  private readonly svgHostRef!: ElementRef<SVGSVGElement>;

  readonly palette = ['#1f6feb', '#4d91ff', '#82b6ff', '#b8d4ff', '#d8e6ff'];
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
    const hostWidth = svgElement.parentElement?.clientWidth ?? 420;
    const width = Math.max(Math.min(hostWidth, 520), 280);
    const height = this.height;
    const radius = Math.min(width, height) / 2 - 14;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    if (!this.data.length) {
      return;
    }

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const root = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<ChartDatum>()
      .value((datum) => datum.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<ChartDatum>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius);

    root
      .selectAll('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_datum, index) => this.palette[index % this.palette.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 3);

    root
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .attr('font-size', 28)
      .attr('font-weight', 700)
      .attr('fill', '#172033')
      .text(d3.format('~s')(d3.sum(this.data, (datum) => datum.value)));

    root
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('font-size', 12)
      .attr('fill', '#5d6980')
      .text(this.centerLabel);
  }
}
