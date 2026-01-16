interface HeaderProps {
  siteName: string;
}

export default function Header({ siteName }: HeaderProps) {
  return (
    <header>
      <nav>
        <div className="logo">{siteName}</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
