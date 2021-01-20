class MediaPlayer {
	constructor(config) {
		const configDefaults = {
			target: '.video-1',
			volume: 30,
			volumeGap: 10,
			progressGap: 5,
		}

		this.config = Object.assign(configDefaults, config);
		this.videoWrapper = document.querySelector(this.config.target);

		// Bail if no main element
		if (!this.videoWrapper) return;

		this.displayTemplate();
		this.assignElements();
		this.addEvents();
	}

	displayTemplate() {
		const URL = this.videoWrapper.dataset.videoUrl;
		this.videoWrapper.innerHTML = `
			<video class="video" src="${URL}"></video>
			<div class="controls">
				<button class="controls__play control tooltip" data-title="play"><i class="fas fa-play"></i></button>

				<div class="volume-wrapper control">
					<button class="controls__volume tooltip" data-title="mute">
						<i class="fas fa-volume-down" id="volume-icon"></i>
					</button>
					<input class="controls__volume-bar" type="range" name="volume-control" id="volume-bar" min="0" max="100"
					value="${this.config.volume}" step="${this.config.volumeGap}"/>
				</div>

				<div class="control">
					<button class="controls__backward position-button tooltip" data-title="<< ${this.config.progressGap}s"><i class="fas fa-backward"></i></button>
					<button class="controls__forward position-button tooltip" data-title="${this.config.progressGap}s >>"><i class="fas fa-forward"></i></button>
				</div>

				<input class="control controls__progress-bar" type="range" min="0" value="0"/>

				<div class="control play-progress">
					<span class="progress"></span>
					<span class="duration"></span>
				</div>
			</div>`;
	}

	assignElements() {
		this.video = this.videoWrapper.querySelector('video');
		this.controls = this.videoWrapper.querySelector('.controls');

		this.video.volume = this.config.volume / 100;
		this.preVolume = this.video.volume;

		this.playPauseButton = this.controls.querySelector('.controls__play');
		this.volumeIcon = this.controls.querySelector('.controls__volume');
		this.volumeInput = this.controls.querySelector('.controls__volume-bar');
		this.backwardForwardButtons = this.controls.querySelectorAll('.position-button');
		this.backwardButton = this.controls.querySelector('.controls__backward');
		this.forwardButton = this.controls.querySelector('.controls__forward');
		this.progressRange = this.controls.querySelector('.controls__progress-bar');
		this.displayVideoDuration = this.controls.querySelector('.duration');
		this.displayProgress = this.controls.querySelector('.progress');
	}

	addEvents() {
		this.playPauseButton.addEventListener('click', this.togglePlayPauseButton.bind(this));

		this.volumeIcon.addEventListener('click', this.muteVideo.bind(this));
		this.volumeInput.addEventListener('input', this.volumeController.bind(this));

		this.video.addEventListener('loadeddata', this.updateProgressBar.bind(this));
		this.video.addEventListener('timeupdate', this.updateProgressBar.bind(this));

		this.progressRange.addEventListener('input', this.setCurrentTime.bind(this));

		this.backwardForwardButtons.forEach((button) => {
			button.addEventListener('click', this.backwardForwardHandler.bind(this));
		});

	}

	transformToMinutesAndSeconds(time) {
		let timeInMinutes = parseInt(time / 60);
		let timeSeconds = Math.round(time % 60);
		if (timeSeconds < 10) {
			timeSeconds = `0${timeSeconds}`;
		}

		return `${timeInMinutes}:${timeSeconds}`;
	}

	backwardForwardHandler(e) {
		let gap = parseInt(this.config.progressGap);
		let buttonPressed = e.currentTarget;
		let buttonPressedClasses = buttonPressed.classList.value;

		if (buttonPressedClasses.includes('backward')) {
			this.video.currentTime -= gap;
		} else if (buttonPressedClasses.includes('forward')) {
			this.video.currentTime += gap;
		}
	}

	togglePlayPauseButton() {
		this.iconClass = this.playPauseButton.querySelector('i').classList;


		if (this.iconClass.contains('fa-play')) {
			this.iconClass.replace('fa-play', 'fa-pause');
			this.video.play();
			this.videoWrapper.classList.add('playing');
			this.playPauseButton.setAttribute('data-title', 'pause');
		} else {
			this.iconClass.replace('fa-pause', 'fa-play');
			this.video.pause();
			this.videoWrapper.classList.remove('playing');
			this.playPauseButton.setAttribute('data-title', 'play');
		}
	}

	volumeController() {
		this.settedVolume = this.volumeInput.value;
		this.volumePercent = this.settedVolume / 100;

		this.video.volume = this.volumePercent;
		this.video.muted = (this.video.volume == 0) ? true : false;

		this.changeVolumeIcon();
	}

	changeVolumeIcon() {
		this.icon = this.volumeIcon.querySelector('i');
		this.iconClass = this.icon.classList;
		this.volume = this.video.volume;

		this.icon.setAttribute('class', 'fas');
		if (this.volume == 0) {
			this.iconClass.add('fa-volume-mute');
		} else if (this.volume < 0.5) {
			this.iconClass.add('fa-volume-down');
		} else {
			this.iconClass.add('fa-volume-up');
		}
	}

	muteVideo() {
		if (!this.video.muted) {
			this.preVolume = this.video.volume;
			this.video.volume = 0;
			this.volumeInput.value = 0;
			this.volumeIcon.setAttribute('data-title', 'unmute');
		} else {
			this.video.volume = this.preVolume;
			this.volumeInput.value = this.preVolume * 100;
			this.volumeIcon.setAttribute('data-title', 'mute');
		}

		this.video.muted = !this.video.muted;

		this.changeVolumeIcon();
	}

	updateProgressBar() {
		let maxRange = Math.round(this.video.duration);

		this.progressRange.setAttribute('max', maxRange);
		this.progressRange.value = this.video.currentTime;
		this.displayProgress.innerHTML = this.transformToMinutesAndSeconds(this.video.currentTime);
		this.displayVideoDuration.innerHTML = `/ ${(this.transformToMinutesAndSeconds(this.video.duration))}`;
	}

	setCurrentTime() {
		let settedCurrentTime = this.progressRange.value;
		this.video.currentTime = settedCurrentTime;
	}
}

let player = new MediaPlayer({
	target: '#video-1',
	volume: 20,
	progressGap: 1,
});




















