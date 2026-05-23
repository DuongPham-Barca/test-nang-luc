interface AvatarProps {
    name: string
    large?: boolean
}

const Avatar = ({ name, large }: AvatarProps) => (
    <div className={`${large ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm'} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-slate-950 font-bold text-white`}>
        {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
)

export default Avatar
