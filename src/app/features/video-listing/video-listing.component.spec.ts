import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Video } from '../../core/Models/video.model';
import { VideoService } from '../../core/Services/video.service';
import { VideoListingComponent } from './video-listing.component';

describe('VideoListingComponent', () => {
  const video: Video = {
    _id: 'video-1',
    title: 'A sample video',
    description: 'A sample description',
    videoUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    durationSeconds: 95,
    channel: { _id: 'channel-1', username: 'creator' },
    tags: [],
    category: 'Learning',
    visibility: 'public',
    views: 24,
    likeCount: 2,
    dislikeCount: 0,
    commentCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  let queryParams: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let videoService: jasmine.SpyObj<VideoService>;

  beforeEach(async () => {
    queryParams = new BehaviorSubject(convertToParamMap({}));
    videoService = jasmine.createSpyObj<VideoService>('VideoService', [
      'getRecommendations',
      'search',
    ]);
    videoService.getRecommendations.and.returnValue(of([video]));
    videoService.search.and.returnValue(of([video]));

    await TestBed.configureTestingModule({
      imports: [VideoListingComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParams } },
        { provide: VideoService, useValue: videoService },
      ],
    }).compileComponents();
  });

  it('loads and displays recommended videos', () => {
    const fixture = TestBed.createComponent(VideoListingComponent);
    fixture.detectChanges();

    expect(videoService.getRecommendations).toHaveBeenCalledWith(30);
    expect(fixture.nativeElement.textContent).toContain('A sample video');
    expect(fixture.nativeElement.textContent).toContain('Learning');
  });

  it('uses the query parameter to load search results', () => {
    const fixture = TestBed.createComponent(VideoListingComponent);
    fixture.detectChanges();

    queryParams.next(convertToParamMap({ q: 'sample' }));
    fixture.detectChanges();

    expect(videoService.search).toHaveBeenCalledWith('sample');
    expect(fixture.nativeElement.textContent).toContain('Results for “sample”');
  });

  it('shows a retryable error when recommendations fail', () => {
    videoService.getRecommendations.and.returnValue(throwError(() => new Error('offline')));
    const fixture = TestBed.createComponent(VideoListingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
