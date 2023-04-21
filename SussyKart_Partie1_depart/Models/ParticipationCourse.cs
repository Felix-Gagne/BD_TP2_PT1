using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Table("ParticipationCourse", Schema = "Courses")]
    public partial class ParticipationCourse
    {
        [Key]
        [Column("ParticipationCourseID")]
        public int ParticipationCourseId { get; set; }
        public int Position { get; set; }
        public int Chrono { get; set; }
        public int NbJoueurs { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DateParticipation { get; set; }
        [Column("CourseID")]
        public int CourseId { get; set; }
        [Column("UtilisateurID")]
        public int UtilisateurId { get; set; }

        [ForeignKey("CourseId")]
        [InverseProperty("ParticipationCourses")]
        public virtual Course Course { get; set; } = null!;
        [ForeignKey("UtilisateurId")]
        [InverseProperty("ParticipationCourses")]
        public virtual Utilisateur Utilisateur { get; set; } = null!;
    }
}
