import React from 'react';
import type { MovieInfo } from '../types';
import { FilmIcon, UploadIcon, ClockIcon, ClapperboardIcon, CameraIcon, MusicIcon, ChatBubbleIcon } from './icons';
import { ImdbIcon, RottenTomatoesFreshIcon, RottenTomatoesRottenIcon, MetacriticScore } from './ratingIcons';

interface MovieInfoDisplayProps {
  fileLoaded: boolean;
  isFetching: boolean;
  movieInfo: MovieInfo | null;
  onFetch: () => void;
  disabled: boolean;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-teal-500 rounded-full animate-spin me-4"></div>
    <span className="text-lg text-gray-600 dark:text-gray-400">در حال دریافت اطلاعات...</span>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <div className="mt-1 text-teal-600 dark:text-teal-400 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</h3>
      <p className="text-base text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  </div>
);

const Ratings: React.FC<{ movieInfo: MovieInfo }> = ({ movieInfo }) => {
  const { imdbRating, rottenTomatoesRating, metacriticRating } = movieInfo;

  // Handles "95%" -> 95
  const rtScore = rottenTomatoesRating ? parseInt(rottenTomatoesRating.replace('%', ''), 10) : NaN;
  // Handles "8.5/10" -> "8.5"
  const imdbScore = imdbRating ? imdbRating.split('/')[0] : '';
  
  const showRatings = (imdbScore && imdbRating !== 'پیدا نشد') ||
                      (!isNaN(rtScore) && rottenTomatoesRating !== 'پیدا نشد') ||
                      (metacriticRating && metacriticRating !== 'پیدا نشد');
  
  if (!showRatings) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4">
      {imdbScore && imdbRating !== 'پیدا نشد' && (
        <div className="flex items-center gap-2" title={`IMDb Rating: ${imdbRating}`}>
          <ImdbIcon className="w-12 h-6" />
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{imdbScore}</span>
        </div>
      )}
      {!isNaN(rtScore) && rottenTomatoesRating !== 'پیدا نشد' && (
        <div className="flex items-center gap-2" title={`Rotten Tomatoes: ${rottenTomatoesRating}`}>
          {rtScore >= 60 ? <RottenTomatoesFreshIcon className="w-7 h-7" /> : <RottenTomatoesRottenIcon className="w-7 h-7" />}
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{`${rtScore}%`}</span>
        </div>
      )}
      {metacriticRating && metacriticRating !== 'پیدا نشد' && (
        <div className="flex items-center gap-2" title={`Metacritic Score: ${metacriticRating}`}>
          <MetacriticScore score={metacriticRating} />
        </div>
      )}
    </div>
  );
};

const toPersianNumber = (n: number | string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
};

const convertToShamsi = (gregorianYear: string): string => {
  const yearNumber = parseInt(gregorianYear.trim(), 10);
  if (isNaN(yearNumber) || yearNumber < 622) {
    return '';
  }
  const shamsiYear = yearNumber - 621;
  return toPersianNumber(shamsiYear);
};

export const MovieInfoDisplay: React.FC<MovieInfoDisplayProps> = ({ fileLoaded, isFetching, movieInfo, onFetch, disabled }) => {
  if (!fileLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        <UploadIcon className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">ابتدا یک فایل زیرنویس بارگذاری کنید</h2>
        <p>پس از بارگذاری فایل، می‌توانید مشخصات فیلم مربوطه را در این بخش مشاهده کنید.</p>
      </div>
    );
  }

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (!movieInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <button
          onClick={onFetch}
          disabled={disabled}
          className="flex items-center gap-3 px-5 py-2 text-base font-bold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
        >
          <FilmIcon className="w-6 h-6" />
          دریافت مشخصات فیلم
        </button>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          با کلیک بر روی این دکمه، اطلاعات فیلم از طریق گوگل جستجو می‌شود.
        </p>
      </div>
    );
  }
  
  const shamsiYear = movieInfo.year && movieInfo.year !== 'پیدا نشد' ? convertToShamsi(movieInfo.year) : '';

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50">
      <div className="text-center mb-6 border-b border-gray-300 dark:border-gray-600 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 ltr">
            {movieInfo.title} ({movieInfo.year})
        </h2>
        {movieInfo.persianTitle && movieInfo.persianTitle !== 'پیدا نشد' && movieInfo.persianTitle !== movieInfo.title && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                {movieInfo.persianTitle}
                {shamsiYear && <span className="text-base font-normal ms-2">({shamsiYear} شمسی)</span>}
            </p>
        )}
        <Ratings movieInfo={movieInfo} />
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
          <InfoItem label="کارگردان" value={movieInfo.director} icon={<ClapperboardIcon className="w-6 h-6" />} />
          <InfoItem label="مدت زمان" value={movieInfo.duration} icon={<ClockIcon className="w-6 h-6" />} />
          <InfoItem label="ژانر" value={movieInfo.genre} icon={<FilmIcon className="w-6 h-6" />} />
          <InfoItem label="زبان" value={movieInfo.language} icon={<ChatBubbleIcon className="w-6 h-6" />} />
          <InfoItem label="موسیقی" value={movieInfo.music} icon={<MusicIcon className="w-6 h-6" />} />
          <InfoItem label="فیلمبرداری" value={movieInfo.cinematography} icon={<CameraIcon className="w-6 h-6" />} />
        </div>
        
        <div>
          <h3 className="text-base font-bold text-teal-600 dark:text-teal-400 border-b-2 border-teal-500/50 pb-1 mb-2">بازیگران اصلی</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{movieInfo.cast}</p>
        </div>
        
        <div>
          <h3 className="text-base font-bold text-teal-600 dark:text-teal-400 border-b-2 border-teal-500/50 pb-1 mb-2">خلاصه داستان</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-normal text-justify">{movieInfo.plot}</p>
        </div>
      </div>
    </div>
  );
};