namespace SussyKart_Partie1.ViewModels
{

    public class AmiVM
    {
        public int AmiID { get; set; }
        public string Pseudo { get; set; } = null!;
        public DateTime DernierePartie { get; set; }
        public DateTime DateInscription { get; set; }
        public string? ImageUrl { get; set; }
    }
}
