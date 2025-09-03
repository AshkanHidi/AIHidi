/**
 * @file This file centralizes all icons used in the application by re-exporting them from the 'lucide-react' library.
 * This approach provides a single source of truth for icons, making it easy to manage, update, or replace them application-wide.
 * We use aliasing (e.g., `Trash2 as TrashIcon`) to maintain consistent naming within the app and abstract the specific icon source.
 * To add a new icon, simply import it from 'lucide-react' and export it here with a descriptive name.
 */

export {
    Plus as PlusIcon,
    Trash2 as TrashIcon,
    Check as CheckmarkIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    CheckCircle2 as CheckCircleIcon,
    XCircle as XCircleIcon,
    AlertTriangle as ExclamationTriangleIcon,
    Clock as ClockIcon,
    HelpCircle as QuestionMarkCircleIcon,
    KeyRound as KeyIcon,
    Cpu as ChipIcon,
    Pencil as PencilIcon,
    Cog as CogIcon,
    FileText as FileTextIcon,
    Globe as GlobeIcon,
    Terminal as TerminalIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
    Film as FilmIcon,
    Clapperboard as ClapperboardIcon,
    Camera as CameraIcon,
    Music as MusicIcon,
    MessageSquare as ChatBubbleIcon,
    Home as HomeIcon,
    User as UserIcon,
    Search as SearchIcon,
    Play as PlayIcon,
    StopCircle as StopCircleIcon,
    Send as TelegramIcon,
    Mail as MailIcon,
} from 'lucide-react';