using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Table("Utilisateur", Schema = "Utilisateurs")]
    [Index("Pseudo", Name = "UC_Utilisateur_Pseudo", IsUnique = true)]
    public partial class Utilisateur
    {
        public Utilisateur()
        {
            AmitieUtilisateurIdAmiNavigations = new HashSet<Amitie>();
            AmitieUtilisateurs = new HashSet<Amitie>();
            ParticipationCourses = new HashSet<ParticipationCourse>();
        }

        [Key]
        [Column("UtilisateurID")]
        public int UtilisateurId { get; set; }
        [StringLength(30)]
        public string Pseudo { get; set; } = null!;
        [Column(TypeName = "datetime")]
        public DateTime DateInscription { get; set; }
        [StringLength(320)]
        public string Courriel { get; set; } = null!;
        public bool EstSuppr { get; set; }
        [MaxLength(32)]
        public byte[]? MotDePasseHache { get; set; }
        [MaxLength(16)]
        public byte[]? MdpSel { get; set; }
        public byte[]? NoBancaire { get; set; }

        [InverseProperty("UtilisateurIdAmiNavigation")]
        public virtual ICollection<Amitie> AmitieUtilisateurIdAmiNavigations { get; set; }
        [InverseProperty("Utilisateur")]
        public virtual ICollection<Amitie> AmitieUtilisateurs { get; set; }
        [InverseProperty("Utilisateur")]
        public virtual ICollection<ParticipationCourse> ParticipationCourses { get; set; }
    }
}
